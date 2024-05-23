import { BadRequestException, Injectable } from '@nestjs/common';

import { QuizResultRepository } from '#databases/repositories/quizResult.repository';

import { RequestCreateQuizResultDto } from './dto/create-quiz-result.dto';

@Injectable()
export class QuizService {
	constructor(private readonly quizResultRepository: QuizResultRepository) {}

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
}
