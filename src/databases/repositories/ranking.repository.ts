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
		const requestTime = dayjs.tz();
		const currentWeek = requestTime.week();
		const currentYear = requestTime.year();

		const isSunday = requestTime.day() === 0;
		const previousWeek = isSunday ? currentWeek - 2 : currentWeek - 1;

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
				'word.diacritic',
			])
			.orderBy('ranking.rank')
			.getMany();
	}

	findBySpecificWeek({ year, week }: RequestRankingByWeekDto) {
		return this.rankingRepository
			.createQueryBuilder('ranking')
			.select([
				'ranking.id',
				'ranking.score',
				'word.id',
				'word.name',
				'word.description',
				'word.pronunciation',
				'word.diacritic',
				'ROW_NUMBER() OVER (ORDER BY ranking.score) as rank',
			])
			.leftJoin('ranking.word', 'word')
			.where('ranking.year = :year', { year })
			.andWhere('ranking.week = :week', { week })
			.orderBy('ranking.score')
			.take(10)
			.getRawMany();
	}

	findBySpecificMonth({ year, month }: RequestRankingByMonthDto) {
		return this.rankingRepository
			.createQueryBuilder('ranking')
			.select([
				'ranking.id',
				'ranking.score',
				'word.id',
				'word.name',
				'word.description',
				'word.pronunciation',
				'word.diacritic',
				'ROW_NUMBER() OVER (ORDER BY ranking.score) as rank',
			])
			.leftJoin('ranking.word', 'word')
			.where('ranking.year = :year', { year })
			.andWhere('ranking.month = :month', { month })
			.orderBy('ranking.score')
			.take(10)
			.getRawMany();
	}

	findBySpecificYear({ year }: RequestRankingByYearDto) {
		return this.rankingRepository
			.createQueryBuilder('ranking')
			.select([
				'ranking.id',
				'ranking.score',
				'word.id',
				'word.name',
				'word.description',
				'word.pronunciation',
				'word.diacritic',
				'ROW_NUMBER() OVER (ORDER BY ranking.score) as rank',
			])
			.leftJoin('ranking.word', 'word')
			.where('ranking.year = :year', { year })
			.orderBy('ranking.score')
			.take(10)
			.getRawMany();
	}
}
