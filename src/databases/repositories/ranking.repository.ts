import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RequestRankingByWeekDto } from '#/ranking/dto/rank-by-week.dto';
import { RequestRankingByYearDto } from '#/ranking/dto/rank-by-year.dto';
import { Ranking } from '#databases/entities/ranking.entity';
import dayjs from '#utils/dayjs';
import { RequestRankingByMonthDto } from '#/ranking/dto/rank-by-month.dto';

@Injectable()
export class RankingRepository {
	constructor(
		@InjectRepository(Ranking)
		private readonly rankingRepository: Repository<Ranking>,
	) {}

	findByCurrentWeek() {
		const currentWeek = dayjs().week();
		const currentYear = dayjs().year();

		return this.rankingRepository
			.createQueryBuilder('ranking')
			.where('ranking.year = :currentYear', { currentYear })
			.andWhere('ranking.week = :currentWeek', { currentWeek })
			.leftJoin('ranking.words', 'word')
			.select([
				'ranking.rank',
				'ranking.rankChange',
				'word.id',
				'word.name',
				'word.description',
				'word.pronunciation',
			])
			.orderBy('ranking.rank')
			.getMany();
	}

	findBySpecificWeek({ year, week }: RequestRankingByWeekDto) {
		return this.rankingRepository
			.createQueryBuilder('ranking')
			.where('ranking.year = :year', { year })
			.andWhere('ranking.week = :week', { week })
			.leftJoin('ranking.words', 'word')
			.select([
				'ranking.rank',
				'ranking.rankChange',
				'word.id',
				'word.name',
				'word.description',
				'word.pronunciation',
			])
			.orderBy('ranking.rank')
			.getMany();
	}

	findBySpecificMonth({ year, month }: RequestRankingByMonthDto) {
		return this.rankingRepository
			.createQueryBuilder('ranking')
			.where('ranking.year = :year', { year })
			.andWhere('ranking.month = :month', { month })
			.leftJoin('ranking.words', 'word')
			.select([
				'ranking.score',
				'ranking.rankChange',
				'word.id',
				'word.name',
				'word.description',
				'word.pronunciation',
			])
			.orderBy('ranking.score')
			.take(10)
			.getMany();
	}

	findBySpecificYear({ year }: RequestRankingByYearDto) {
		return this.rankingRepository
			.createQueryBuilder('ranking')
			.where('ranking.year = :year', { year })
			.leftJoin('ranking.words', 'word')
			.select([
				'ranking.score',
				'ranking.rankChange',
				'word.id',
				'word.name',
				'word.description',
				'word.pronunciation',
			])
			.orderBy('ranking.score')
			.take(10)
			.getMany();
	}
}
