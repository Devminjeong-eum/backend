import { Injectable } from '@nestjs/common';

import { and, asc, count, eq, ilike, isNull, sql } from 'drizzle-orm';

import type { RequestWordSearchDto } from '#/domain/word-search/dto/word-search.dto';
import { InjectDrizzleClient } from '#/infrastructure/drizzle/decorator/inject-drizzle-client.decorator';
import { like, word, wordSearch } from '#/infrastructure/drizzle/schema';

import { DrizzlePgClient } from '../interface/drizzle-pg-client.interface';

@Injectable()
export class WordSearchRepository {
	constructor(
		@InjectDrizzleClient()
		private readonly db: DrizzlePgClient,
	) {}

	async create({ wordId, keyword }: { wordId: string; keyword: string }) {
		const [queryResult] = await this.db
			.insert(wordSearch)
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
			.update(wordSearch)
			.set({ keyword })
			.where(eq(wordSearch.wordId, wordId))
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
				id: word.id,
				name: word.name,
				diacritic: word.diacritic,
			})
			.from(wordSearch)
			.leftJoin(word, eq(wordSearch.wordId, word.id))
			.where(ilike(wordSearch.keyword, `${keyword}%`))
			.limit(limit)
			.offset((page - 1) * limit)
			.execute();

		const totalCountQuery = this.db
			.select({
				count: count(word.id),
			})
			.from(wordSearch)
			.leftJoin(word, eq(wordSearch.wordId, word.id))
			.where(ilike(wordSearch.keyword, `${keyword}%`));

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
				id: word.id,
				name: word.name,
				pronunciation: word.pronunciation,
				diacritic: word.diacritic,
				description: word.description,
				createdAt: word.createdAt,
				isLike: userId
					? sql<boolean>`CASE 
					  WHEN ${like.id} IS NOT NULL THEN true 
					  ELSE false 
					END`.as('isLike')
					: sql`false::boolean`.as('isLike'),
			})
			.from(wordSearch)
			.innerJoin(word, eq(wordSearch.wordId, word.id))
			.leftJoin(
				like,
				and(
					eq(like.wordId, word.id),
					isNull(like.deletedAt),
					userId ? eq(like.userId, userId) : undefined,
				),
			)
			.where(ilike(wordSearch.keyword, `${keyword}%`))
			.orderBy(asc(word.createdAt))
			.offset(getSkip())
			.limit(limit);

		const totalCountQuery = this.db
			.select({
				count: count(word.id),
			})
			.from(wordSearch)
			.where(ilike(wordSearch.keyword, `${keyword}%`))
			.leftJoin(like, and(eq(like.wordId, word.id)));

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
