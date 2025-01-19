import { Module } from '@nestjs/common';

import { RankingRepository } from '#/infrastructure/drizzle/repository/ranking.repository';

import { RankingController } from './ranking.controller';
import { RankingService } from './service/ranking.service';

@Module({
	controllers: [RankingController],
	providers: [
		// Service
		RankingService,
		// Repository
		RankingRepository,
	],
})
export class RankingModule {}
