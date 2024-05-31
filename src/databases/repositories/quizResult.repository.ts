import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';

import { RequestCreateQuizResultDto } from '#/quiz/dto/create-quiz-result.dto';
import { QuizResult } from '#databases/entities/quizResult.entity';
import { User } from '#databases/entities/user.entity';
import { generateNanoId } from '#utils/nanoid';

@Injectable()
export class QuizResultRepository {
	constructor(
		@InjectRepository(QuizResult)
		private readonly quizResultRepository: Repository<QuizResult>,
	) {}

	private async generatedQuizResultId() {
		let id: string = "";
		let isAlreadyUsed: boolean = true;

		while (isAlreadyUsed) {
			id = generateNanoId(6);
			isAlreadyUsed = await this.quizResultRepository.exists({ where: { id } });
		}

		return id;
	}

	async create(user: User, createQuizResultDto: RequestCreateQuizResultDto) {
		const { correctWordIds, incorrectWordIds } = createQuizResultDto;
		const expiredAt = dayjs().add(1, 'day').toDate();

		const quizResultId = await this.generatedQuizResultId();
		const quizResult = this.quizResultRepository.create({
			user,
			correctWordIds,
			incorrectWordIds,
			expiredAt,
			id: quizResultId,
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
