import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { plainToInstance } from 'class-transformer';

import { SpreadSheetService } from '#/spread-sheet/spread-sheet.service';
import { QuizResultRepository } from '#databases/repositories/quizResult.repository';
import { QuizSelectionRepository } from '#databases/repositories/quizSelection.repository';
import { WordRepository } from '#databases/repositories/word.repository';

import {
	RequestCreateQuizResultDto,
	ResponseCreateQuizResultDto,
} from './dto/create-quiz-result.dto';
import { RequestCreateQuizSelectDto } from './dto/create-quiz-selection.dto';
import {
	RequestQuizResultDto,
	ResponseQuizResultDto,
} from './dto/quiz-result.dto';
import { ResponseQuizSelectionDto } from './dto/quiz-selection.dto';
import { RequestUpdateQuizSelectDto } from './dto/update-quiz-selection.dto';

@Injectable()
export class QuizService {
	constructor(
		private readonly spreadSheetService: SpreadSheetService,
		private readonly quizResultRepository: QuizResultRepository,
		private readonly quizSelectionRepository: QuizSelectionRepository,
		private readonly wordRepository: WordRepository,
	) {}

	private readonly MAX_QUIZ_AMOUNT = 10;
	private readonly SPREAD_SHEET_UUID_ROW = 'D';
	private readonly SPREAD_SHEET_NAME = 'quizSelection';
	private readonly parseQuizSelectionFromSheet = (
		[name, correct, rawIncorrectList, uuid]: string[],
		index: number,
	) => {
		const incorrectList = rawIncorrectList
			.split(',')
			.map((word) => word.trim());

		return {
			name,
			correct,
			incorrectList,
			uuid,
			index: index + 2, // NOTE : SpreadSheet 의 경우 2번부터 단어 시작
		};
	};

	async updateQuizSelectionList() {
		const parsedSheetDataList =
			await this.spreadSheetService.parseSpreadSheet({
				sheetName: this.SPREAD_SHEET_NAME,
				range: 'A2:Z',
				parseCallback: this.parseQuizSelectionFromSheet,
			});

		if (!parsedSheetDataList.length) return true;

		for await (const {
			name,
			correct,
			incorrectList,
			uuid,
			index,
		} of parsedSheetDataList) {
			const word = await this.wordRepository.findByName(name);

			if (!word)
				throw new InternalServerErrorException(
					`${name} 단어는 현재 Word 에 저장되어 있지 않습니다.`,
				);

			const isExist = await this.quizSelectionRepository.findById(uuid);

			const quizSelectionEntity = isExist
				? await this.quizSelectionRepository.update(
						uuid,
						plainToInstance(RequestUpdateQuizSelectDto, {
							correct,
							incorrectList,
						}),
					)
				: await this.quizSelectionRepository.create(
						word,
						plainToInstance(RequestCreateQuizSelectDto, {
							correct,
							incorrectList,
						}),
					);

			if (!isExist) {
				await this.spreadSheetService.insertCellData({
					sheetName: this.SPREAD_SHEET_NAME,
					range: `${this.SPREAD_SHEET_UUID_ROW}${index}`,
					value: quizSelectionEntity.id,
				});
			}
		}

		return true;
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
		name: 'update-quiz-selections',
		timeZone: 'Asia/Seoul',
	})
	async updateQuizSelectionListBatch() {
		return await this.updateQuizSelectionList();
	}

	async createQuizResult(createQuizResultDto: RequestCreateQuizResultDto) {
		const { correctWordIds, incorrectWordIds } = createQuizResultDto;
		const isValidQuizAmount =
			new Set([...correctWordIds, ...incorrectWordIds]).size !==
			this.MAX_QUIZ_AMOUNT;

		if (isValidQuizAmount) {
			throw new BadRequestException(
				'퀴즈에 포함된 문제의 수량은 10개여야 합니다.',
			);
		}

		const [isValidCorrectWords, isValidIncorrectWords] = await Promise.all([
			this.wordRepository.checkIsExistsByIdList(correctWordIds),
			this.wordRepository.checkIsExistsByIdList(incorrectWordIds),
		]);

		if (!isValidCorrectWords || !isValidIncorrectWords) {
			throw new BadRequestException(
				'단어 목록 중에 유효하지 않은 ID 가 있습니다.',
			);
		}

		const createdQuizResult =
			await this.quizResultRepository.create(createQuizResultDto);

		const responseCreateQuizResultDto = plainToInstance(
			ResponseCreateQuizResultDto,
			createdQuizResult,
			{ excludeExtraneousValues: true },
		);

		return responseCreateQuizResultDto;
	}

	async findQuizResultById(quizResultDto: RequestQuizResultDto) {
		const { userId, quizResultId } = quizResultDto;
		const quizResult =
			await this.quizResultRepository.findById(quizResultId);

		if (!quizResult) {
			throw new BadRequestException(
				'해당 ID 를 가진 퀴즈 결과 데이터가 없습니다.',
			);
		}

		if (quizResult.expiredAt <= new Date()) {
			throw new NotFoundException(
				'해당 ID 를 가진 퀴즈 결과 데이터는 만료되어 접근할 수 없습니다.',
			);
		}

		const { correctWordIds, incorrectWordIds } = quizResult;
		const [correctWords, incorrectWords] = await Promise.all([
			this.wordRepository.findByIdListWithUserLike({
				wordIdList: correctWordIds,
				userId,
			}),
			this.wordRepository.findByIdListWithUserLike({
				wordIdList: incorrectWordIds,
				userId,
			}),
		]);

		const correctWordAmount = correctWords.length;
		const incorrectWordAmount = incorrectWords.length;

		if (correctWordAmount + incorrectWordAmount !== 10) {
			throw new InternalServerErrorException(
				'유효하지 않은 않은 퀴즈 결과 데이터입니다. 관리자에게 문의하세요.',
			);
		}

		const score = correctWordAmount * 10;
		const responseQuizResultDto = plainToInstance(
			ResponseQuizResultDto,
			{
				quizResultId,
				score,
				correctWords,
				incorrectWords,
			},
			{
				excludeExtraneousValues: true,
			},
		);

		return responseQuizResultDto;
	}

	async findQuizSelectionByWordId(wordId: string) {
		const quizSelection =
			await this.quizSelectionRepository.findByWordId(wordId);

		if (!quizSelection) {
			throw new BadRequestException(
				'해당 단어 ID 를 가진 퀴즈 선택 데이터가 없습니다.',
			);
		}

		return quizSelection;
	}

	async findQuizSelectionRandom() {
		const quizSelectionList =
			await this.quizSelectionRepository.findRandomQuizSelection();

		const responseQuizSelectionDto = plainToInstance(
			ResponseQuizSelectionDto,
			quizSelectionList,
			{ excludeExtraneousValues: true },
		);

		return responseQuizSelectionDto;
	}
}
