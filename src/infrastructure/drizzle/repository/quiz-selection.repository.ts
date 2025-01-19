import { Injectable } from '@nestjs/common';

import { eq, exists, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { InjectDrizzleClient } from '#/infrastructure/drizzle/decorator/inject-drizzle-client.decorator';
import * as schema from '#/infrastructure/drizzle/schema';

@Injectable()
export class QuizSelectionRepository {
	constructor(
		@InjectDrizzleClient()
		private readonly db: NodePgDatabase<typeof schema>,
	) {}

	async create({
		wordId,
		correct,
		incorrectList,
	}: {
		wordId: string;
		correct: string;
		incorrectList: string[];
	}) {
		const [queryResult] = await this.db
			.insert(schema.quizSelection)
			.values({
				wordId,
				correct,
				incorrectList,
			})
			.returning();

		return queryResult;
	}

	async update({
		quizSelectionId,
		correct,
		incorrectList,
	}: {
		quizSelectionId: number;
		correct: string;
		incorrectList: string[];
	}) {
		const [queryResult] = await this.db
			.update(schema.quizSelection)
			.set({
				correct,
				incorrectList,
			})
			.where(eq(schema.quizSelection.id, quizSelectionId))
			.returning();

		return queryResult;
	}

	async findById({ quizSelectionId }: { quizSelectionId: number }) {
		const [queryResult] = await this.db
			.select()
			.from(schema.quizSelection)
			.where(exists(eq(schema.quizSelection.id, quizSelectionId)))
			.limit(1)
			.execute();

		return queryResult;
	}

	async findByWordId({ wordId }: { wordId: string }) {
		const [queryResult] = await this.db
			.select({
				quizSelectionId: schema.quizSelection.id,
				correct: schema.quizSelection.correct,
				incorrectList: schema.quizSelection.incorrectList,
				wordName: schema.word.name,
			})
			.from(schema.quizSelection)
			.leftJoin(
				schema.word,
				eq(schema.quizSelection.wordId, schema.word.id),
			)
			.where(eq(schema.quizSelection.wordId, wordId))
			.limit(1)
			.execute();

		return queryResult;
	}

	async findRandomQuizSelection() {
		const randomizeQuizSelection = await this.db
			.select({
				quizSelectionId: schema.quizSelection.id,
				correct: schema.quizSelection.correct,
				incorrectList: schema.quizSelection.incorrectList,
				wordId: schema.word.id,
				wordName: schema.word.name,
				wordDiacritic: schema.word.diacritic,
			})
			.from(schema.quizSelection)
			.leftJoin(
				schema.word,
				eq(schema.quizSelection.wordId, schema.word.id),
			)
			.orderBy(sql`RANDOM()`)
			.limit(10)
			.execute();

		return randomizeQuizSelection;
	}
}
