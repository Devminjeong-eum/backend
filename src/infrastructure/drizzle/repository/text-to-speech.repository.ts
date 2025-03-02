import { Injectable } from '@nestjs/common';

import { eq } from 'drizzle-orm';

import { InjectDrizzleClient } from '#/infrastructure/drizzle/decorator/inject-drizzle-client.decorator';
import { textToSpeech } from '#/infrastructure/drizzle/schema';

import { DrizzlePgClient } from '../interface/drizzle-pg-client.interface';

@Injectable()
export class TextToSpeechRepository {
	constructor(
		@InjectDrizzleClient()
		private readonly db: DrizzlePgClient,
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
			.insert(textToSpeech)
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
			.update(textToSpeech)
			.set({
				audioFileUri,
				text,
			})
			.where(eq(textToSpeech.wordId, wordId))
			.execute();
	}

	async findByWordId({ wordId }: { wordId: string }) {
		const queryResult = await this.db
			.select()
			.from(textToSpeech)
			.where(eq(textToSpeech.wordId, wordId))
			.limit(1)
			.execute();

		return queryResult[0];
	}
}
