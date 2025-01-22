import { Injectable } from '@nestjs/common';

import { and, eq, sql } from 'drizzle-orm';

import type { RequestRankingByMonthDto } from '#/domain/ranking/dto/rank-by-month.dto';
import type { RequestRankingByWeekDto } from '#/domain/ranking/dto/rank-by-week.dto';
import type { RequestRankingByYearDto } from '#/domain/ranking/dto/rank-by-year.dto';
import { InjectDrizzleClient } from '#/infrastructure/drizzle/decorator/inject-drizzle-client.decorator';
import { ranking, word } from '#/infrastructure/drizzle/schema';
import dayjs from '#/shared/utils/dayjs';

import { DrizzlePgClient } from '../interface/drizzle-pg-client.interface';

@Injectable()
export class RankingRepository {
	constructor(
		@InjectDrizzleClient()
		private readonly db: DrizzlePgClient,
	) {}

	async findByCurrentWeek() {
		const requestTime = dayjs.tz();
		const currentWeek = requestTime.week();
		const currentYear = requestTime.year();

		const isSunday = requestTime.day() === 0;
		const previousWeek = isSunday ? currentWeek - 2 : currentWeek - 1;

		return this.db
			.select({
				rank: ranking.rank,
				rankChange: ranking.rankChange,
				wordId: word.id,
				wordName: word.name,
				wordDescription: word.description,
				wordPronunciation: word.pronunciation,
				wordDiacritic: word.diacritic,
			})
			.from(ranking)
			.where(
				and(
					eq(ranking.year, currentYear),
					eq(ranking.week, previousWeek),
				),
			)
			.leftJoin(word, eq(ranking.wordId, word.id))
			.orderBy(ranking.rank)
			.execute();
	}

	async findBySpecificWeek({ year, week }: RequestRankingByWeekDto) {
		return this.db
			.select({
				id: ranking.id,
				score: ranking.score,
				wordId: word.id,
				wordName: word.name,
				wordDescription: word.description,
				wordPronunciation: word.pronunciation,
				wordDiacritic: word.diacritic,
				rank: sql`ROW_NUMBER() OVER (ORDER BY ${ranking.score})`.as(
					'rank',
				),
			})
			.from(ranking)
			.leftJoin(word, eq(ranking.wordId, word.id))
			.where(and(eq(ranking.year, year), eq(ranking.week, week)))
			.orderBy(ranking.score)
			.limit(10)
			.execute();
	}

	async findBySpecificMonth({ year, month }: RequestRankingByMonthDto) {
		return this.db
			.select({
				id: ranking.id,
				score: ranking.score,
				wordId: word.id,
				wordName: word.name,
				wordDescription: word.description,
				wordPronunciation: sql`${word.pronunciation}[1]`.as(
					'wordPronunciation',
				),
				wordDiacritic: sql`${word.diacritic}[1]`.as('wordDiacritic'),
				rank: sql`ROW_NUMBER() OVER (ORDER BY ${ranking.score})`.as(
					'rank',
				),
			})
			.from(ranking)
			.leftJoin(word, eq(ranking.wordId, word.id))
			.where(and(eq(ranking.year, year), eq(ranking.month, month)))
			.orderBy(ranking.score)
			.limit(10)
			.execute();
	}

	async findBySpecificYear({ year }: RequestRankingByYearDto) {
		return this.db
			.select({
				id: ranking.id,
				score: ranking.score,
				wordId: word.id,
				wordName: word.name,
				wordDescription: word.description,
				wordPronunciation: word.pronunciation,
				wordDiacritic: word.diacritic,
				rank: sql`ROW_NUMBER() OVER (ORDER BY ${ranking.score})`.as(
					'rank',
				),
			})
			.from(ranking)
			.leftJoin(word, eq(ranking.wordId, word.id))
			.where(eq(ranking.year, year))
			.orderBy(ranking.score)
			.limit(10)
			.execute();
	}
}
