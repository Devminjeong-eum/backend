import { Module } from '@nestjs/common';
import { RankingRepository } from '#/infrastructure/database/repositories/ranking.repository';

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
