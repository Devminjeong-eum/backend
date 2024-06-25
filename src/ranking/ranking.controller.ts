import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiDocs } from '#/common/decorators/swagger.decorator';

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
import { RankingService } from './ranking.service';

@ApiTags('Ranking')
@Controller('ranking')
export class RankingController {
	constructor(private readonly rankingService: RankingService) {}

	@ApiDocs({
		summary: '현재 일자를 기준으로 가장 최신의 랭킹 정보를 받아옵니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseCurrentRankingDto,
		},
	})
	@Get('/current')
	findCurrentWeekRanking() {
		return this.rankingService.findCurrentWeekRanking();
	}

	@ApiDocs({
		summary: '특정 년도의 특정 주차에 대한 랭킹 정보를 받아옵니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseRankingByWeekDto,
		},
	})
	@Get('/week')
	findSpecificWeekRanking(
		@Query() rankingByWeekDto: RequestRankingByWeekDto,
	) {
		return this.rankingService.findSpecificWeekRanking(rankingByWeekDto);
	}

	@ApiDocs({
		summary: '특정 년도에 속한 월간 랭킹 정보를 받아옵니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseRankingByMonthDto,
		},
	})
	@Get('/month')
	findSpecificMonthRanking(
		@Query() rankingByMonthDto: RequestRankingByMonthDto,
	) {
		return this.rankingService.findSpecificMonthRanking(rankingByMonthDto);
	}

	@ApiDocs({
		summary: '특정 년도를 선택하여 연간 랭킹 정보를 받아옵니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseRankingByYearDto,
		},
	})
	@Get('/year')
	findSpecificYearRanking(
		@Query() rankingByYearDto: RequestRankingByYearDto,
	) {
		return this.rankingService.findSpecificYearRanking(rankingByYearDto);
	}
}
