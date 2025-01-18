import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import dayjs from 'dayjs';
import { Repository } from 'typeorm';

import type { RequestCreateQuizResultDto } from '#/domain/quiz/dto/create-quiz-result.dto';
import { QuizResult } from '#/infrastructure/database/entities/quiz-result.entity';
import type { User } from '#/infrastructure/database/entities/user.entity';
import { generateNanoId } from '#/shared/utils/nanoid';

@Injectable()
export class QuizResultRepository {
	constructor(
		@InjectRepository(QuizResult)
		private readonly quizResultRepository: Repository<QuizResult>,
	) {}

	private QUIZ_RESULT_ID_LENGTH = 6;
	private async generatedQuizResultId() {
		let id: string;
		let isAlreadyUsed: boolean;

		do {
			id = generateNanoId({
				allowedOption: ['UPPERCASE', 'NUMBER'],
				length: this.QUIZ_RESULT_ID_LENGTH,
			});
			isAlreadyUsed = await this.quizResultRepository.exists({
				where: { id },
			});
		} while (isAlreadyUsed);

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
			.leftJoin('quizResult.user', 'user')
			.where('quizResult.id = :quizResultId', { quizResultId })
			.select([
				'user.name',
				'quizResult.id',
				'quizResult.correctWordIds',
				'quizResult.incorrectWordIds',
			])
			.getOne();
	}
}
