import { Injectable } from '@nestjs/common';

import { RankingRepository } from '#/databases/repositories/ranking.repository';
import { RequestRankingByWeekDto } from './dto/rank-by-week.dto';
import { RequestRankingByMonthDto } from './dto/rank-by-month.dto';
import { RequestRankingByYearDto } from './dto/rank-by-year.dto';

@Injectable()
export class RankingService {
	constructor(private readonly rankingRepository: RankingRepository) {}

	findCurrentWeekRanking() {
		const ranking = this.rankingRepository.findByCurrentWeek();
		return ranking;
	}


	findSpecificWeekRanking(rankingByWeekDto: RequestRankingByWeekDto) {
		const ranking = this.rankingRepository.findBySpecificWeek(rankingByWeekDto);
		return ranking;
	}

	findSpecificMonthRanking(rankingByMonthDto: RequestRankingByMonthDto) {
		const ranking = this.rankingRepository.findBySpecificMonth(rankingByMonthDto);
		return ranking;
	}

	findSpecificYearRanking(rankingByYearDto: RequestRankingByYearDto) {
		const ranking = this.rankingRepository.findBySpecificYear(rankingByYearDto);
		return ranking;
	}
}
