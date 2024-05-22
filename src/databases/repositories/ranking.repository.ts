import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Ranking } from '#databases/entities/ranking.entity';

@Injectable()
export class RankingRepository {
	constructor(
		@InjectRepository(Ranking)
		private readonly rankingRepository: Repository<Ranking>,
	) {}

	findByDate({
		year,
		month,
		day,
	}: {
		year: number;
		month: number;
		day: number;
	}) {
		return this.rankingRepository
			.createQueryBuilder('ranking')
			.where({ year, month, day })
			.leftJoin('ranking.words', 'word')
			.select([
				'ranking.rank',
				'ranking.rankChange',
				'word.id',
				'word.name',
				'word.description',
				'word.pronunciation',
			])
			.getRawMany()
	}
}
