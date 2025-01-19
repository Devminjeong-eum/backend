import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';
import { eq, exists, getTableColumns } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { InjectDrizzleClient } from '#/infrastructure/drizzle/decorator/inject-drizzle-client.decorator';
import * as schema from '#/infrastructure/drizzle/schema';
import { generateNanoId } from '#/shared/utils/nanoid';

@Injectable()
export class QuizResultRepository {
	constructor(
		@InjectDrizzleClient()
		private readonly db: NodePgDatabase<typeof schema>,
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
				.from(schema.quizResult)
				.where(exists(eq(schema.quizResult.id, id)))
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
			.insert(schema.quizResult)
			.values({
				userId,
				correctWordIds,
				incorrectWordIds,
				expiredAt,
				id: quizResultId,
			})
			.execute();
	}

	async findById({ quizResultId }: { quizResultId: string }) {
		const { userId: _userId, ...restQuizResultColumns } = getTableColumns(
			schema.quizResult,
		);

		const selectResult = await this.db
			.select({
				userName: schema.user.name,
				...restQuizResultColumns,
			})
			.from(schema.quizResult)
			.leftJoin(schema.user, eq(schema.quizResult.userId, schema.user.id))
			.where(eq(schema.quizResult.id, quizResultId))
			.limit(1)
			.execute();

		return selectResult[0];
	}
}
