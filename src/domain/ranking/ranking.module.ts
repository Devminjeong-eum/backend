import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ranking } from '#/infrastructure/database/entities/ranking.entity';
import { RankingRepository } from '#/infrastructure/database/repositories/ranking.repository';

import { RankingController } from './ranking.controller';
import { RankingService } from './service/ranking.service';

@Module({
	imports: [TypeOrmModule.forFeature([Ranking])],
	controllers: [RankingController],
	providers: [
		// Service
		RankingService,
		// Repository
		RankingRepository,
	],
})
export class RankingModule {}
