import { Injectable } from '@nestjs/common';

import { and, count, eq, ilike, inArray, isNull, sql } from 'drizzle-orm';

import type { RequestWordListDto } from '#/domain/word/dto/word-list.dto';
import type { RequestWordUserLikeDto } from '#/domain/word/dto/word-user-like.dto';
import { WORD_SORTING_TYPE } from '#/domain/word/interface/word-list-sorting.interface';
import { InjectDrizzleClient } from '#/infrastructure/drizzle/decorator/inject-drizzle-client.decorator';
import { like, word } from '#/infrastructure/drizzle/schema';

import { DrizzlePgClient } from '../interface/drizzle-pg-client.interface';

@Injectable()
export class WordRepository {
	constructor(
		@InjectDrizzleClient()
		private readonly db: DrizzlePgClient,
	) {}

	async create({
		name,
		description,
		diacritic,
		pronunciation,
		wrongPronunciations,
		exampleSentence,
	}: {
		name: string;
		description: string;
		diacritic: string[];
		pronunciation: string[];
		wrongPronunciations: string[];
		exampleSentence: string;
	}) {
		const [queryResult] = await this.db
			.insert(word)
			.values({
				name,
				description,
				diacritic,
				pronunciation,
				wrongPronunciations,
				exampleSentence,
			})
			.returning();

		return queryResult;
	}

	async update({
		id,
		name,
		description,
		diacritic,
		pronunciation,
		wrongPronunciations,
		exampleSentence,
	}: {
		id: string;
		name: string;
		description: string;
		diacritic: string[];
		pronunciation: string[];
		wrongPronunciations: string[];
		exampleSentence: string;
	}) {
		const [queryResult] = await this.db
			.update(word)
			.set({
				name,
				description,
				diacritic,
				pronunciation,
				wrongPronunciations,
				exampleSentence,
			})
			.where(eq(word.id, id))
			.returning();

		return queryResult;
	}

	async findByName(name: string) {
		const [queryResult] = await this.db
			.select()
			.from(word)
			.where(eq(word.name, name))
			.limit(1)
			.execute();

		return queryResult;
	}

	async findById({ wordId }: { wordId: string }) {
		const [queryResult] = await this.db
			.select()
			.from(word)
			.where(eq(word.id, wordId))
			.limit(1)
			.execute();

		return queryResult;
	}

	async checkIsExistsByIdList({ wordIdList }: { wordIdList: string[] }) {
		if (!wordIdList.length) return false;

		const queryResult = await this.db
			.select()
			.from(word)
			.where(inArray(word.id, wordIdList))
			.limit(wordIdList.length)
			.execute();

		return queryResult.length === wordIdList.length;
	}

	async findByIdListWithUserLike({
		wordIdList,
		userId,
	}: {
		wordIdList: string[];
		userId: string | null;
	}) {
		if (!wordIdList.length) return [];

		// 공통 SELECT 쿼리
		const queryResult = this.db
			.select({
				id: word.id,
				name: word.name,
				diacritic: word.diacritic,
				pronunciation: word.pronunciation,
				isLike: userId
					? sql<boolean>`SUM(CASE WHEN ${like.userId} = ${userId} THEN 1 ELSE 0 END) > 0`.as(
							'isLike',
						)
					: sql`false::boolean`.as('isLike'),
			})
			.from(word)
			.leftJoin(
				like,
				and(eq(word.id, like.wordId), isNull(like.deletedAt)),
			)
			.where(inArray(word.id, wordIdList))
			.groupBy(word.id)
			.execute();

		return queryResult;
	}

	async findByIdWithUserLike({
		wordId,
		userId,
	}: {
		wordId: string;
		userId?: string;
	}) {
		const [queryResult] = await this.db
			.select({
				id: word.id,
				name: word.name,
				description: word.description,
				diacritic: word.diacritic,
				pronunciation: word.pronunciation,
				wrongPronunciations: word.wrongPronunciations,
				exampleSentence: word.exampleSentence,
				likeCount: this.db
					.$count(like, eq(like.wordId, word.id))
					.as('likeCount'),
				isLike: userId
					? sql<boolean>`SUM(CASE WHEN ${like.userId} = ${userId} THEN 1 ELSE 0 END) > 0`.as(
							'isLike',
						)
					: sql`false::boolean`.as('isLike'),
			})
			.from(word)
			.leftJoin(like, eq(word.id, like.wordId))
			.where(eq(word.id, wordId))
			.groupBy(word.id)
			.execute();

		return queryResult;
	}

	async findByNameWithUserLike({
		name,
		userId,
	}: {
		name: string;
		userId?: string;
	}) {
		const [queryResult] = await this.db
			.select({
				id: word.id,
				name: word.name,
				description: word.description,
				diacritic: word.diacritic,
				pronunciation: word.pronunciation,
				wrongPronunciations: word.wrongPronunciations,
				exampleSentence: word.exampleSentence,
				likeCount: this.db
					.$count(like, eq(like.wordId, word.id))
					.as('likeCount'),
				isLike: userId
					? sql<boolean>`SUM(CASE WHEN ${like.userId} = ${userId} THEN 1 ELSE 0 END) > 0`.as(
							'isLike',
						)
					: sql`false::boolean`.as('isLike'),
			})
			.from(word)
			.leftJoin(like, eq(word.id, like.wordId))
			.where(ilike(word.name, `${name}%`))
			.groupBy(word.id)
			.execute();

		return queryResult;
	}

	async findWithList(requestWordListDto: RequestWordListDto) {
		const { userId, sorting } = requestWordListDto;
		const [sortOption, sortingFn] = WORD_SORTING_TYPE[sorting];

		const wordList = await this.db
			.select({
				id: word.id,
				name: word.name,
				description: word.description,
				diacritic: word.diacritic,
				pronunciation: word.pronunciation,
				wrongPronunciations: word.wrongPronunciations,
				exampleSentence: word.exampleSentence,
				likeCount: this.db.$count(like, eq(like.wordId, word.id)),
				isLike: userId
					? sql<boolean>`SUM(CASE WHEN ${like.userId} = ${userId} THEN 1 ELSE 0 END) > 0`
					: sql`false::boolean`,
			})
			.from(word)
			.leftJoin(like, eq(word.id, like.wordId))
			.groupBy(word.id)
			.orderBy(sortingFn(sortOption))
			.offset(requestWordListDto.getSkip())
			.limit(requestWordListDto.limit)
			.execute();

		const totalCount = await this.db.$count(word);

		return {
			words: wordList,
			totalCount,
		};
	}

	async findUserLikeWord(requestWordListDto: RequestWordUserLikeDto) {
		const { userId, sorting } = requestWordListDto;
		const [sortOption, sortingFn] = WORD_SORTING_TYPE[sorting];

		const words = await this.db
			.select({
				id: word.id,
				name: word.name,
				description: word.description,
				diacritic: word.diacritic,
				pronunciation: word.pronunciation,
				likeCount: this.db
					.$count(like, eq(like.wordId, word.id))
					.as('likeCount'),
			})
			.from(word)
			.where(userId ? eq(like.userId, userId) : undefined)
			.leftJoin(like, eq(word.id, like.wordId))
			.groupBy(word.id)
			.orderBy(sortingFn(sortOption))
			.offset(requestWordListDto.getSkip())
			.limit(requestWordListDto.limit)
			.execute();

		const [totalQueryResult] = await this.db
			.select({
				count: count(word.id),
			})
			.from(word)
			.where(userId ? eq(like.userId, userId) : undefined)
			.leftJoin(like, eq(word.id, like.wordId))
			.execute();

		const totalCount = totalQueryResult?.count ?? 0;

		return {
			words,
			totalCount,
		};
	}
}
