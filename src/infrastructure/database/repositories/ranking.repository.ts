import { Injectable } from '@nestjs/common';

import { and, eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import type { RequestRankingByMonthDto } from '#/domain/ranking/dto/rank-by-month.dto';
import type { RequestRankingByWeekDto } from '#/domain/ranking/dto/rank-by-week.dto';
import type { RequestRankingByYearDto } from '#/domain/ranking/dto/rank-by-year.dto';
import { InjectDrizzleClient } from '#/infrastructure/drizzle/decorator/inject-drizzle-client.decorator';
import * as schema from '#/infrastructure/drizzle/schema';
import dayjs from '#/shared/utils/dayjs';

@Injectable()
export class RankingRepository {
	constructor(
		@InjectDrizzleClient()
		private readonly db: NodePgDatabase<typeof schema>,
	) {}

	async findByCurrentWeek() {
		const requestTime = dayjs.tz();
		const currentWeek = requestTime.week();
		const currentYear = requestTime.year();

		const isSunday = requestTime.day() === 0;
		const previousWeek = isSunday ? currentWeek - 2 : currentWeek - 1;

		return this.db
			.select({
				rank: schema.ranking.rank,
				rankChange: schema.ranking.rankChange,
				wordId: schema.word.id,
				wordName: schema.word.name,
				wordDescription: schema.word.description,
				wordPronunciation: schema.word.pronunciation,
				wordDiacritic: schema.word.diacritic,
			})
			.from(schema.ranking)
			.where(
				and(
					eq(schema.ranking.year, currentYear),
					eq(schema.ranking.week, previousWeek),
				),
			)
			.leftJoin(schema.word, eq(schema.ranking.wordId, schema.word.id))
			.orderBy(schema.ranking.rank)
			.execute();
	}

	async findBySpecificWeek({ year, week }: RequestRankingByWeekDto) {
		return this.db
			.select({
				id: schema.ranking.id,
				score: schema.ranking.score,
				wordId: schema.word.id,
				wordName: schema.word.name,
				wordDescription: schema.word.description,
				wordPronunciation: schema.word.pronunciation,
				wordDiacritic: schema.word.diacritic,
				rank: sql`ROW_NUMBER() OVER (ORDER BY ${schema.ranking.score})`.as(
					'rank',
				),
			})
			.from(schema.ranking)
			.leftJoin(schema.word, eq(schema.ranking.wordId, schema.word.id))
			.where(
				and(
					eq(schema.ranking.year, year),
					eq(schema.ranking.week, week),
				),
			)
			.orderBy(schema.ranking.score)
			.limit(10)
			.execute();
	}

	async findBySpecificMonth({ year, month }: RequestRankingByMonthDto) {
		return this.db
			.select({
				id: schema.ranking.id,
				score: schema.ranking.score,
				wordId: schema.word.id,
				wordName: schema.word.name,
				wordDescription: schema.word.description,
				wordPronunciation: sql`${schema.word.pronunciation}[1]`.as(
					'wordPronunciation',
				),
				wordDiacritic: sql`${schema.word.diacritic}[1]`.as(
					'wordDiacritic',
				),
				rank: sql`ROW_NUMBER() OVER (ORDER BY ${schema.ranking.score})`.as(
					'rank',
				),
			})
			.from(schema.ranking)
			.leftJoin(schema.word, eq(schema.ranking.wordId, schema.word.id))
			.where(
				and(
					eq(schema.ranking.year, year),
					eq(schema.ranking.month, month),
				),
			)
			.orderBy(schema.ranking.score)
			.limit(10)
			.execute();
	}

	async findBySpecificYear({ year }: RequestRankingByYearDto) {
		return this.db
			.select({
				id: schema.ranking.id,
				score: schema.ranking.score,
				wordId: schema.word.id,
				wordName: schema.word.name,
				wordDescription: schema.word.description,
				wordPronunciation: schema.word.pronunciation,
				wordDiacritic: schema.word.diacritic,
				rank: sql`ROW_NUMBER() OVER (ORDER BY ${schema.ranking.score})`.as(
					'rank',
				),
			})
			.from(schema.ranking)
			.leftJoin(schema.word, eq(schema.ranking.wordId, schema.word.id))
			.where(eq(schema.ranking.year, year))
			.orderBy(schema.ranking.score)
			.limit(10)
			.execute();
	}
}
