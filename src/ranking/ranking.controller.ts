import { Controller, Delete, Get, Param } from '@nestjs/common';

import { RankingService } from './ranking.service';

@Controller('ranking')
export class RankingController {
	constructor(private readonly rankingService: RankingService) {}

	@Get()
	findAll() {
		return this.rankingService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.rankingService.findOne(+id);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.rankingService.remove(+id);
	}
}
