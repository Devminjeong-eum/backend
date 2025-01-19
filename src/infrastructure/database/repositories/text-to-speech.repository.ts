import { Injectable } from '@nestjs/common';

import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { InjectDrizzleClient } from '#/infrastructure/drizzle/decorator/inject-drizzle-client.decorator';
import * as schema from '#/infrastructure/drizzle/schema';

@Injectable()
export class TextToSpeechRepository {
	constructor(
		@InjectDrizzleClient()
		private readonly db: NodePgDatabase<typeof schema>,
	) {}

	async create({
		wordId,
		text,
		audioFileUri,
	}: {
		wordId: string;
		text: string;
		audioFileUri: string;
	}) {
		return this.db
			.insert(schema.textToSpeech)
			.values({
				wordId,
				text,
				audioFileUri,
			})
			.returning();
	}

	async update({
		wordId,
		text,
		audioFileUri,
	}: {
		wordId: string;
		text: string;
		audioFileUri: string;
	}) {
		await this.db
			.update(schema.textToSpeech)
			.set({
				audioFileUri,
				text,
			})
			.where(eq(schema.textToSpeech.wordId, wordId))
			.execute();
	}

	async findByWordId({wordId}:{wordId: string}) {
		const queryResult = await this.db
			.select()
			.from(schema.textToSpeech)
			.where(eq(schema.textToSpeech.wordId, wordId))
			.limit(1)
			.execute();

		return queryResult[0];
	}
}
