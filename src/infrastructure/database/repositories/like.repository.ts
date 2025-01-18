import { Injectable } from '@nestjs/common';

import { and, eq, isNotNull, isNull, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { InjectDrizzleClient } from '#/infrastructure/drizzle/decorator/inject-drizzle-client.decorator';
import * as schema from '#/infrastructure/drizzle/schema';

@Injectable()
export class LikeRepository {
	constructor(
		@InjectDrizzleClient()
		private readonly db: NodePgDatabase<typeof schema>,
	) {}

	async create({ wordId, userId }: { wordId: string; userId: string }) {
		return this.db
			.insert(schema.like)
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
			.from(schema.like)
			.where(
				and(
					isNull(schema.like.deletedAt),
					eq(schema.like.wordId, wordId),
					eq(schema.like.userId, userId),
				),
			)
			.limit(1)
			.execute();
	}

	async restore({ wordId, userId }: { wordId: string; userId: string }) {
		return this.db
			.update(schema.like)
			.set({
				deletedAt: null,
			})
			.where(
				and(
					isNotNull(schema.like.deletedAt),
					eq(schema.like.wordId, wordId),
					eq(schema.like.userId, userId),
				),
			)
			.execute();
	}

	async softDelete({ wordId, userId }: { wordId: string; userId: string }) {
		return this.db
			.update(schema.like)
			.set({
				deletedAt: sql`now()`,
			})
			.where(
				and(
					isNull(schema.like.deletedAt),
					eq(schema.like.wordId, wordId),
					eq(schema.like.userId, userId),
				),
			)
			.execute();
	}
}
