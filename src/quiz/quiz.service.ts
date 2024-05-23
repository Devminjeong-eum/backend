import { BadRequestException, Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { QuizResultRepository } from '#databases/repositories/quizResult.repository';
import { WordRepository } from '#databases/repositories/word.repository';

import { RequestCreateQuizResultDto } from './dto/create-quiz-result.dto';
import {
	RequestQuizResultDto,
	ResponseQuizResultDto,
} from './dto/quiz-result.dto';

@Injectable()
export class QuizService {
	constructor(
		private readonly quizResultRepository: QuizResultRepository,
		private readonly wordRepository: WordRepository,
	) {}

	private MAX_QUIZ_AMOUNT = 10;

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

		return await this.quizResultRepository.create(createQuizResultDto);
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

		const responseQuizResultDto = plainToInstance(ResponseQuizResultDto, {
			id,
			correctWords,
			incorrectWords,
		});

		return responseQuizResultDto;
	}
}
