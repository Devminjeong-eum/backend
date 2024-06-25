import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RequestRankingByMonthDto } from '#/ranking/dto/rank-by-month.dto';
import { RequestRankingByWeekDto } from '#/ranking/dto/rank-by-week.dto';
import { RequestRankingByYearDto } from '#/ranking/dto/rank-by-year.dto';
import { Ranking } from '#databases/entities/ranking.entity';
import dayjs from '#utils/dayjs';

@Injectable()
export class RankingRepository {
	constructor(
		@InjectRepository(Ranking)
		private readonly rankingRepository: Repository<Ranking>,
	) {}

	findByCurrentWeek() {
		const startDayOfPreviousWeek = dayjs()
			.startOf('week')
			.subtract(1, 'week');
		const previousWeek = startDayOfPreviousWeek.week();
		const currentYear = startDayOfPreviousWeek.year();

		return this.rankingRepository
			.createQueryBuilder('ranking')
			.where('ranking.year = :currentYear', { currentYear })
			.andWhere('ranking.week = :previousWeek', { previousWeek })
			.leftJoin('ranking.word', 'word')
			.select([
				'ranking.rank',
				'ranking.rankChange',
				'word.id',
				'word.name',
				'word.description',
				'word.pronunciation',
				'word.diacritic'
			])
			.orderBy('ranking.rank')
			.getMany();
	}

	findBySpecificWeek({ year, week }: RequestRankingByWeekDto) {
		return this.rankingRepository
			.createQueryBuilder('ranking')
			.where('ranking.year = :year', { year })
			.andWhere('ranking.week = :week', { week })
			.leftJoin('ranking.word', 'word')
			.select([
				'ranking.rank',
				'word.id',
				'word.name',
				'word.description',
				'word.pronunciation',
				'word.diacritic'
			])
			.orderBy('ranking.rank')
			.getMany();
	}

	findBySpecificMonth({ year, month }: RequestRankingByMonthDto) {
		return this.rankingRepository
			.createQueryBuilder('ranking')
			.where('ranking.year = :year', { year })
			.andWhere('ranking.month = :month', { month })
			.leftJoin('ranking.word', 'word')
			.select([
				'ranking.score',
				'word.id',
				'word.name',
				'word.description',
				'word.pronunciation',
				'word.diacritic'
			])
			.orderBy('ranking.score')
			.take(10)
			.getMany();
	}

	findBySpecificYear({ year }: RequestRankingByYearDto) {
		return this.rankingRepository
			.createQueryBuilder('ranking')
			.where('ranking.year = :year', { year })
			.leftJoin('ranking.word', 'word')
			.select([
				'ranking.score',
				'word.id',
				'word.name',
				'word.description',
				'word.pronunciation',
				'word.diacritic'
			])
			.orderBy('ranking.score')
			.take(10)
			.getMany();
	}
}
