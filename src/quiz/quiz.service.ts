import { BadRequestException, Injectable } from '@nestjs/common';
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
	private readonly SPREAD_SHEET_UUID_ROW = 'E';

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

		const { id, correctWordIds, incorrectWordIds } = quizResult;
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

		const score = correctWordIds.length * 10;

		const responseQuizResultDto = plainToInstance(
			ResponseQuizResultDto,
			{
				quizResultId: id,
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

	createQuizSelection(createQuizSelectionDto: RequestCreateQuizSelectDto) {
		return this.quizSelectionRepository.create(createQuizSelectionDto);
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

	async updateQuizSelectionList() {
		const parsedSheetDataList =
			await this.spreadSheetService.parseQuizSelectionSheet();

		if (!parsedSheetDataList.length) return true;

		for await (const {
			quizSelectionId,
			index,
			...quizSelectionInformation
		} of parsedSheetDataList) {
			const isExist =
				await this.quizSelectionRepository.findById(quizSelectionId);

			const quizSelectionEntity = isExist
				? await this.quizSelectionRepository.update(
						quizSelectionId,
						plainToInstance(
							RequestUpdateQuizSelectDto,
							quizSelectionInformation,
						),
					)
				: await this.quizSelectionRepository.create(
						plainToInstance(
							RequestCreateQuizSelectDto,
							quizSelectionInformation,
						),
					);

			if (!isExist) {
				const insertedCellLocation = `${this.SPREAD_SHEET_UUID_ROW}${index}`;
				await this.spreadSheetService.insertCellData(
					'quizSelection',
					insertedCellLocation,
					quizSelectionEntity.id,
				);
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
}
