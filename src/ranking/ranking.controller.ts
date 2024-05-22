import { Controller, Get } from '@nestjs/common';

import { RankingService } from './ranking.service';

@Controller('ranking')
export class RankingController {
	constructor(private readonly rankingService: RankingService) {}

	@Get()
	findCurrentRanking() {
		return this.rankingService.findCurrentRanking();
	}
}
