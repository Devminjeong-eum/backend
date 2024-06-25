import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { RankingRepository } from '#/databases/repositories/ranking.repository';

import { ResponseCurrentRankingDto } from './dto/rank-by-current.dto';
import {
	RequestRankingByMonthDto,
	ResponseRankingByMonthDto,
} from './dto/rank-by-month.dto';
import {
	RequestRankingByWeekDto,
	ResponseRankingByWeekDto,
} from './dto/rank-by-week.dto';
import {
	RequestRankingByYearDto,
	ResponseRankingByYearDto,
} from './dto/rank-by-year.dto';

@Injectable()
export class RankingService {
	constructor(private readonly rankingRepository: RankingRepository) {}

	async findCurrentWeekRanking() {
		const ranking = await this.rankingRepository.findByCurrentWeek();
		const responseCurrentRankingDto = plainToInstance(
			ResponseCurrentRankingDto,
			ranking,
			{ excludeExtraneousValues: true },
		);
		return responseCurrentRankingDto;
	}

	async findSpecificWeekRanking(rankingByWeekDto: RequestRankingByWeekDto) {
		const ranking =
			await this.rankingRepository.findBySpecificWeek(rankingByWeekDto);
		const responseWeekRankingDto = plainToInstance(
			ResponseRankingByWeekDto,
			ranking,
			{ excludeExtraneousValues: true },
		);
		return responseWeekRankingDto;
	}

	findSpecificMonthRanking(rankingByMonthDto: RequestRankingByMonthDto) {
		const ranking =
			this.rankingRepository.findBySpecificMonth(rankingByMonthDto);
		const responseMonthRankingDto = plainToInstance(
			ResponseRankingByMonthDto,
			ranking,
			{ excludeExtraneousValues: true },
		);
		return responseMonthRankingDto;
	}

	findSpecificYearRanking(rankingByYearDto: RequestRankingByYearDto) {
		const ranking =
			this.rankingRepository.findBySpecificYear(rankingByYearDto);
		const responseYearRankingDto = plainToInstance(
			ResponseRankingByYearDto,
			ranking,
			{ excludeExtraneousValues: true },
		);
		return responseYearRankingDto;
	}
}
