import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RequestCreateQuizResultDto } from '#/quiz/dto/create-quiz-result.dto';
import { QuizResult } from '#databases/entities/quizResult.entity';
import { User } from '#databases/entities/user.entity';

@Injectable()
export class QuizResultRepository {
	constructor(
		@InjectRepository(QuizResult)
		private readonly quizResultRepository: Repository<QuizResult>,
	) {}

	async create(createQuizResultDto: RequestCreateQuizResultDto) {
		const { userId, correctWordIds, incorrectWordIds } =
			createQuizResultDto;

		const user = new User();
		user.id = userId;

		const quizResult = new QuizResult();
		quizResult.user = user;
		quizResult.correctWordIds = correctWordIds;
		quizResult.incorrectWordIds = incorrectWordIds;

		return this.quizResultRepository.save(quizResult);
	}

	async findById(quizResultId: string) {
		return await this.quizResultRepository.findOneBy({ id: quizResultId });
	}
}
