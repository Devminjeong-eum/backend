import { Injectable } from '@nestjs/common';

import { and, eq, isNotNull, isNull, sql } from 'drizzle-orm';

import { InjectDrizzleClient } from '#/infrastructure/drizzle/decorator/inject-drizzle-client.decorator';
import { like } from '#/infrastructure/drizzle/schema';

import { DrizzlePgClient } from '../interface/drizzle-pg-client.interface';

@Injectable()
export class LikeRepository {
	constructor(
		@InjectDrizzleClient()
		private readonly db: DrizzlePgClient,
	) {}

	async create({ wordId, userId }: { wordId: string; userId: string }) {
		return this.db
			.insert(like)
			.values({
				wordId: wordId,
				userId: userId,
			})
			.returning();
	}

	async findByUserAndWord({
		wordId,
		userId,
	}: {
		wordId: string;
		userId: string;
	}) {
		return this.db
			.select()
			.from(like)
			.where(
				and(
					isNull(like.deletedAt),
					eq(like.wordId, wordId),
					eq(like.userId, userId),
				),
			)
			.limit(1)
			.execute();
	}

	async restore({ wordId, userId }: { wordId: string; userId: string }) {
		return this.db
			.update(like)
			.set({
				deletedAt: null,
			})
			.where(
				and(
					isNotNull(like.deletedAt),
					eq(like.wordId, wordId),
					eq(like.userId, userId),
				),
			)
			.execute();
	}

	async softDelete({ wordId, userId }: { wordId: string; userId: string }) {
		return this.db
			.update(like)
			.set({
				deletedAt: sql`now()`,
			})
			.where(
				and(
					isNull(like.deletedAt),
					eq(like.wordId, wordId),
					eq(like.userId, userId),
				),
			)
			.execute();
	}
}
