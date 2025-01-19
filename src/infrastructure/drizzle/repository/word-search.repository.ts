import { Injectable } from '@nestjs/common';

import { and, asc, count, eq, ilike, isNull, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import type { RequestWordSearchDto } from '#/domain/word-search/dto/word-search.dto';
import { InjectDrizzleClient } from '#/infrastructure/drizzle/decorator/inject-drizzle-client.decorator';
import * as schema from '#/infrastructure/drizzle/schema';

@Injectable()
export class WordSearchRepository {
	constructor(
		@InjectDrizzleClient()
		private readonly db: NodePgDatabase<typeof schema>,
	) {}

	async create({ wordId, keyword }: { wordId: string; keyword: string }) {
		const [queryResult] = await this.db
			.insert(schema.wordSearch)
			.values({
				wordId,
				keyword,
			})
			.returning();

		return queryResult;
	}

	async updateKeyword({
		wordId,
		keyword,
	}: {
		wordId: string;
		keyword: string;
	}) {
		const [queryResult] = await this.db
			.update(schema.wordSearch)
			.set({ keyword })
			.where(eq(schema.wordSearch.wordId, wordId))
			.returning();

		return queryResult;
	}

	async findByRelatedSearchWord({
		keyword,
		page,
		limit,
	}: {
		keyword: string;
		page: number;
		limit: number;
	}) {
		const paginationQuery = this.db
			.select({
				id: schema.word.id,
				name: schema.word.name,
				diacritic: schema.word.diacritic,
			})
			.from(schema.wordSearch)
			.leftJoin(schema.word, eq(schema.wordSearch.wordId, schema.word.id))
			.where(ilike(schema.wordSearch.keyword, `${keyword}%`))
			.limit(limit)
			.offset((page - 1) * limit)
			.execute();

		const totalCountQuery = this.db
			.select({
				count: count(schema.word.id),
			})
			.from(schema.wordSearch)
			.leftJoin(schema.word, eq(schema.wordSearch.wordId, schema.word.id))
			.where(ilike(schema.wordSearch.keyword, `${keyword}%`));

		const [paginationQueryResult, totalCountQueryResult] =
			await Promise.all([paginationQuery, totalCountQuery]);

		return {
			words: paginationQueryResult,
			totalCount: totalCountQueryResult[0]?.count ?? 0,
		};
	}

	async findBySearchWord(requestWordSearchDto: RequestWordSearchDto) {
		const { keyword, userId, getSkip, limit } = requestWordSearchDto;

		const wordsQuery = this.db
			.selectDistinct({
				id: schema.word.id,
				name: schema.word.name,
				pronunciation: schema.word.pronunciation,
				diacritic: schema.word.diacritic,
				description: schema.word.description,
				createdAt: schema.word.createdAt,
				isLike: userId
					? sql<boolean>`CASE 
					  WHEN ${schema.like.id} IS NOT NULL THEN true 
					  ELSE false 
					END`.as('isLike')
					: sql`false::boolean`.as('isLike'),
			})
			.from(schema.wordSearch)
			.innerJoin(
				schema.word,
				eq(schema.wordSearch.wordId, schema.word.id),
			)
			.leftJoin(
				schema.like,
				and(
					eq(schema.like.wordId, schema.word.id),
					isNull(schema.like.deletedAt),
					userId ? eq(schema.like.userId, userId) : undefined,
				),
			)
			.where(ilike(schema.wordSearch.keyword, `${keyword}%`))
			.orderBy(asc(schema.word.createdAt))
			.offset(getSkip())
			.limit(limit);

		const totalCountQuery = this.db
			.select({
				count: count(schema.word.id),
			})
			.from(schema.wordSearch)
			.where(ilike(schema.wordSearch.keyword, `${keyword}%`))
			.leftJoin(schema.like, and(eq(schema.like.wordId, schema.word.id)));

		const [wordsResult, totalCountResult] = await Promise.all([
			wordsQuery.execute(),
			totalCountQuery.execute(),
		]);

		return {
			words: wordsResult,
			totalCount: totalCountResult[0]?.count ?? 0,
		};
	}
}
