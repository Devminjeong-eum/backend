import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';

import { QuizResult } from '#databases/entities/quizResult.entity';
import { User } from '#databases/entities/user.entity';
import { RequestCreateQuizResultDto } from '#/quiz/dto/create-quiz-result.dto';

@Injectable()
export class QuizResultRepository {
	constructor(
		@InjectRepository(QuizResult)
		private readonly quizResultRepository: Repository<QuizResult>,
	) {}

	async create(user: User, createQuizResultDto: RequestCreateQuizResultDto) {
		const { correctWordIds, incorrectWordIds } = createQuizResultDto;
		const expiredAt = dayjs().add(1, 'day').toDate();

		const quizResult = this.quizResultRepository.create({
			user,
			correctWordIds,
			incorrectWordIds,
			expiredAt,
		});

		return this.quizResultRepository.save(quizResult);
	}

	async findById(quizResultId: string) {
		return await this.quizResultRepository
			.createQueryBuilder('quizResult')
			.where('quizResult.id = :quizResultId', { quizResultId })
			.getOne();
	}
}
