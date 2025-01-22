import { Injectable } from '@nestjs/common';

import { eq, exists, sql } from 'drizzle-orm';

import { InjectDrizzleClient } from '#/infrastructure/drizzle/decorator/inject-drizzle-client.decorator';
import { quizSelection, word } from '#/infrastructure/drizzle/schema';

import { DrizzlePgClient } from '../interface/drizzle-pg-client.interface';

@Injectable()
export class QuizSelectionRepository {
	constructor(
		@InjectDrizzleClient()
		private readonly db: DrizzlePgClient,
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
			.insert(quizSelection)
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
			.update(quizSelection)
			.set({
				correct,
				incorrectList,
			})
			.where(eq(quizSelection.id, quizSelectionId))
			.returning();

		return queryResult;
	}

	async findById({ quizSelectionId }: { quizSelectionId: number }) {
		const [queryResult] = await this.db
			.select()
			.from(quizSelection)
			.where(exists(eq(quizSelection.id, quizSelectionId)))
			.limit(1)
			.execute();

		return queryResult;
	}

	async findByWordId({ wordId }: { wordId: string }) {
		const [queryResult] = await this.db
			.select({
				quizSelectionId: quizSelection.id,
				correct: quizSelection.correct,
				incorrectList: quizSelection.incorrectList,
				wordName: word.name,
			})
			.from(quizSelection)
			.leftJoin(word, eq(quizSelection.wordId, word.id))
			.where(eq(quizSelection.wordId, wordId))
			.limit(1)
			.execute();

		return queryResult;
	}

	async findRandomQuizSelection() {
		const randomizeQuizSelection = await this.db
			.select({
				quizSelectionId: quizSelection.id,
				correct: quizSelection.correct,
				incorrectList: quizSelection.incorrectList,
				wordId: word.id,
				wordName: word.name,
				wordDiacritic: word.diacritic,
			})
			.from(quizSelection)
			.leftJoin(word, eq(quizSelection.wordId, word.id))
			.orderBy(sql`RANDOM()`)
			.limit(10)
			.execute();

		return randomizeQuizSelection;
	}
}
