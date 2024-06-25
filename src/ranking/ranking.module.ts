import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ranking } from '#databases/entities/ranking.entity';
import { RankingRepository } from '#databases/repositories/ranking.repository';

import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';

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
