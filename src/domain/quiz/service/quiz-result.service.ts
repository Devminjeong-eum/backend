import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { QuizResultRepository } from '#/infrastructure/drizzle/repository/quiz-result.repository';
import { QuizSelectionRepository } from '#/infrastructure/drizzle/repository/quiz-selection.repository';
import { WordRepository } from '#/infrastructure/drizzle/repository/word.repository';

import { ResponseCreateQuizResultDto } from '../dto/create-quiz-result.dto';
import { ResponseQuizResultDto } from '../dto/quiz-result.dto';
import { ResponseQuizSelectionDto } from '../dto/quiz-selection.dto';

@Injectable()
export class QuizResultService {
	constructor(
		private readonly quizResultRepository: QuizResultRepository,
		private readonly quizSelectionRepository: QuizSelectionRepository,
		private readonly wordRepository: WordRepository,
	) {}

	private readonly MAX_QUIZ_AMOUNT = 10;

	async createQuizResult({
		userId,
		correctWordIds,
		incorrectWordIds,
	}: {
		userId: string;
		correctWordIds: string[];
		incorrectWordIds: string[];
	}) {
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

		const createdQuizResult = await this.quizResultRepository.create({
			userId,
			correctWordIds,
			incorrectWordIds,
		});

		const responseCreateQuizResultDto = plainToInstance(
			ResponseCreateQuizResultDto,
			createdQuizResult,
			{ excludeExtraneousValues: true },
		);

		return responseCreateQuizResultDto;
	}

	async findQuizResultById({
		userId,
		quizResultId,
	}: {
		userId: string;
		quizResultId: string;
	}) {
		const quizResult = await this.quizResultRepository.findById({
			quizResultId,
		});

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

		if (correctWordAmount + incorrectWordAmount !== this.MAX_QUIZ_AMOUNT) {
			throw new InternalServerErrorException(
				'유효하지 않은 않은 퀴즈 결과 데이터입니다. 관리자에게 문의하세요.',
			);
		}

		const score = correctWordAmount * 10;
		const responseQuizResultDto = plainToInstance(
			ResponseQuizResultDto,
			{
				quizResultId,
				userName: quizResult.userName,
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
