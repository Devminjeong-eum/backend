import { Injectable } from '@nestjs/common';

import { and, eq, exists, isNull, sql } from 'drizzle-orm';
import { isNotNil } from 'es-toolkit';

import { InjectDrizzleClient } from '#/infrastructure/drizzle/decorator/inject-drizzle-client.decorator';
import { like, user } from '#/infrastructure/drizzle/schema';
import { generateNanoId } from '#/shared/utils/nanoid';

import { DrizzlePgClient } from '../interface/drizzle-pg-client.interface';

@Injectable()
export class UserRepository {
	constructor(
		@InjectDrizzleClient()
		private readonly db: DrizzlePgClient,
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
				.from(user)
				.where(exists(eq(user.id, id)))
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
			.insert(user)
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
			.from(user)
			.where(and(eq(user.id, userId), isNull(user.deletedAt)))
			.limit(1)
			.execute();
		return isNotNil(queryResult);
	}

	async deleteOne({ userId }: { userId: string }) {
		const [queryResult] = await this.db
			.update(user)
			.set({
				deletedAt: sql`now()`,
			})
			.where(and(isNull(user.deletedAt), eq(user.id, userId)))
			.returning();

		return isNotNil(queryResult);
	}

	async findById({ userId }: { userId: string }) {
		const [queryResult] = await this.db
			.select()
			.from(user)
			.where(and(eq(user.id, userId), isNull(user.deletedAt)))
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
			.from(user)
			.where(
				and(
					eq(user.socialPlatformId, socialPlatformId),
					eq(user.socialType, socialType),
					isNull(user.deletedAt),
				),
			)
			.limit(1)
			.execute();

		return queryResult;
	}

	async findByIdWithLikeRelation({ userId }: { userId: string }) {
		const [queryResult] = await this.db
			.select()
			.from(user)
			.where(and(eq(user.id, userId), isNull(user.deletedAt)))
			.leftJoin(like, eq(like.userId, userId))
			.limit(1)
			.execute();

		return queryResult;
	}

	async findByIdWithLikeCount({ userId }: { userId: string }) {
		const [queryResult] = await this.db
			.select({
				userId: user.id,
				profileImage: user.profileImage,
				userName: user.name,
				likeCount: sql`COUNT(${like.id})`
					.mapWith(Number)
					.as('likeCount'),
			})
			.from(user)
			.where(and(eq(user.id, userId), isNull(user.deletedAt)))
			.leftJoin(like, eq(like.userId, userId))
			.groupBy(user.id)
			.execute();

		return queryResult;
	}

	findByNameWithLikeCount(name: string) {
		return this.db
			.select({
				userId: user.id,
				profileImage: user.profileImage,
				userName: user.name,
				likeCount: sql`COUNT(${like.id})`
					.mapWith(Number)
					.as('likeCount'),
			})
			.from(user)
			.where(and(eq(user.name, name), isNull(user.deletedAt)))
			.leftJoin(like, eq(like.userId, user.id))
			.groupBy(user.id)
			.execute();
	}

	updateName({ userId, name }: { userId: string; name: string }) {
		return this.db
			.update(user)
			.set({ name })
			.where(eq(user.id, userId))
			.returning();
	}
}
