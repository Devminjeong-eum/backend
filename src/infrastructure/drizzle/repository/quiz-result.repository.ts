import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';
import { eq, exists, getTableColumns } from 'drizzle-orm';

import { InjectDrizzleClient } from '#/infrastructure/drizzle/decorator/inject-drizzle-client.decorator';
import { quizResult, user } from '#/infrastructure/drizzle/schema';
import { generateNanoId } from '#/shared/utils/nanoid';

import { DrizzlePgClient } from '../interface/drizzle-pg-client.interface';

@Injectable()
export class QuizResultRepository {
	constructor(
		@InjectDrizzleClient()
		private readonly db: DrizzlePgClient,
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
			const selectResult = await this.db
				.select()
				.from(quizResult)
				.where(exists(eq(quizResult.id, id)))
				.limit(1)
				.execute();
			isAlreadyUsed = selectResult.length > 0;
		} while (isAlreadyUsed);

		return id;
	}

	async create({
		correctWordIds,
		incorrectWordIds,
		userId,
	}: {
		correctWordIds: string[];
		incorrectWordIds: string[];
		userId: string;
	}) {
		const quizResultId = await this.generatedQuizResultId();
		const expiredAt = dayjs().add(1, 'day').toDate();
		return this.db
			.insert(quizResult)
			.values({
				userId,
				correctWordIds,
				incorrectWordIds,
				expiredAt,
				id: quizResultId,
			})
			.returning();
	}

	async findById({ quizResultId }: { quizResultId: string }) {
		const { userId: _userId, ...restQuizResultColumns } =
			getTableColumns(quizResult);

		const [selectResult] = await this.db
			.select({
				userName: user.name,
				...restQuizResultColumns,
			})
			.from(quizResult)
			.leftJoin(user, eq(quizResult.userId, user.id))
			.where(eq(quizResult.id, quizResultId))
			.limit(1)
			.execute();

		return selectResult;
	}
}
