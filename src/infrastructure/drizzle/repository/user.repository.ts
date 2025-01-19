import { Injectable } from '@nestjs/common';

import { and, eq, exists, isNull, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { isNotNil } from 'es-toolkit';

import { InjectDrizzleClient } from '#/infrastructure/drizzle/decorator/inject-drizzle-client.decorator';
import * as schema from '#/infrastructure/drizzle/schema';
import { generateNanoId } from '#/shared/utils/nanoid';

@Injectable()
export class UserRepository {
	constructor(
		@InjectDrizzleClient()
		private readonly db: NodePgDatabase<typeof schema>,
	) {}

	private USER_ID_LENGTH = 8;
	private async generatedUserId() {
		let id: string;
		let isAlreadyUsed: boolean;

		do {
			const nanoId = generateNanoId({
				allowedOption: ['UPPERCASE', 'NUMBER'],
				length: this.USER_ID_LENGTH,
			});
			id = `user_${nanoId}`;
			const selectResult = await this.db
				.select()
				.from(schema.user)
				.where(exists(eq(schema.user.id, id)))
				.limit(1)
				.execute();
			isAlreadyUsed = selectResult.length > 0;
		} while (isAlreadyUsed);

		return id;
	}

	async create({
		name,
		profileImage,
		socialPlatformId,
		socialType,
	}: {
		name: string;
		profileImage: string;
		socialPlatformId: string;
		socialType: string;
	}) {
		const userId = await this.generatedUserId();
		const [queryResult] = await this.db
			.insert(schema.user)
			.values({
				id: userId,
				name,
				profileImage,
				socialPlatformId,
				socialType,
			})
			.returning();

		return queryResult;
	}

	async checkIsExistsById({ userId }: { userId: string }) {
		const [queryResult] = await this.db
			.select()
			.from(schema.user)
			.where(
				and(eq(schema.user.id, userId), isNull(schema.user.deletedAt)),
			)
			.limit(1)
			.execute();
		return isNotNil(queryResult);
	}

	async deleteOne({ userId }: { userId: string }) {
		const [queryResult] = await this.db
			.update(schema.user)
			.set({
				deletedAt: sql`now()`,
			})
			.where(
				and(isNull(schema.user.deletedAt), eq(schema.user.id, userId)),
			)
			.returning();

		return isNotNil(queryResult);
	}

	async findById({ userId }: { userId: string }) {
		const [queryResult] = await this.db
			.select()
			.from(schema.user)
			.where(
				and(eq(schema.user.id, userId), isNull(schema.user.deletedAt)),
			)
			.limit(1)
			.execute();

		return queryResult;
	}

	async findBySocialPlatformId({
		socialPlatformId,
		socialType,
	}: {
		socialPlatformId: string;
		socialType: string;
	}) {
		const [queryResult] = await this.db
			.select()
			.from(schema.user)
			.where(
				and(
					eq(schema.user.socialPlatformId, socialPlatformId),
					eq(schema.user.socialType, socialType),
					isNull(schema.user.deletedAt),
				),
			)
			.limit(1)
			.execute();

		return queryResult;
	}

	async findByIdWithLikeRelation({ userId }: { userId: string }) {
		const [queryResult] = await this.db
			.select()
			.from(schema.user)
			.where(
				and(eq(schema.user.id, userId), isNull(schema.user.deletedAt)),
			)
			.leftJoin(schema.like, eq(schema.like.userId, userId))
			.limit(1)
			.execute();

		return queryResult;
	}

	async findByIdWithLikeCount({ userId }: { userId: string }) {
		const [queryResult] = await this.db
			.select({
				userId: schema.user.id,
				profileImage: schema.user.profileImage,
				userName: schema.user.name,
				likeCount: sql`COUNT(${schema.like.id})`
					.mapWith(Number)
					.as('likeCount'),
			})
			.from(schema.user)
			.where(
				and(eq(schema.user.id, userId), isNull(schema.user.deletedAt)),
			)
			.leftJoin(schema.like, eq(schema.like.userId, userId))
			.groupBy(schema.user.id)
			.execute();

		return queryResult;
	}

	findByNameWithLikeCount(name: string) {
		return this.db
			.select({
				userId: schema.user.id,
				profileImage: schema.user.profileImage,
				userName: schema.user.name,
				likeCount: sql`COUNT(${schema.like.id})`
					.mapWith(Number)
					.as('likeCount'),
			})
			.from(schema.user)
			.where(
				and(eq(schema.user.name, name), isNull(schema.user.deletedAt)),
			)
			.leftJoin(schema.like, eq(schema.like.userId, schema.user.id))
			.groupBy(schema.user.id)
			.execute();
	}

	updateName({ userId, name }: { userId: string; name: string }) {
		return this.db
			.update(schema.user)
			.set({ name })
			.where(eq(schema.user.id, userId))
			.returning();
	}
}
