import { Injectable } from '@nestjs/common';

import { InjectDrizzleClient } from '#/infrastructure/drizzle/decorator/inject-drizzle-client.decorator';
import { wordView } from '#/infrastructure/drizzle/schema';
import { DrizzlePgClient } from '../interface/drizzle-pg-client.interface';

@Injectable()
export class WordViewRepository {
	constructor(
		@InjectDrizzleClient()
		private readonly db: DrizzlePgClient,
	) {}

	async insertWordViewLog({
		wordId,
		viewCount,
		viewedAt,
	}: {
		wordId: string;
		viewCount: number;
		viewedAt: Date;
	}) {
		const [queryResult] = await this.db
			.insert(wordView)
			.values({
				wordId,
				viewCount,
				viewedAt,
			})
			.returning();

		return queryResult;
	}
}
