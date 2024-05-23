import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as dayjs from 'dayjs';
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
		quizResult.expiredAt = dayjs().add(1, 'day').toDate();

		return this.quizResultRepository.save(quizResult);
	}

	async findById(quizResultId: string) {
		return await this.quizResultRepository
			.createQueryBuilder('quizResult')
			.where('quizResult.id = :quizResultId', { quizResultId })
			.andWhere('quizResult.expiredAt < :now', { now: new Date() })
			.getOne();
	}
}
