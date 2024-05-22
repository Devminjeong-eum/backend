import { Injectable } from '@nestjs/common';

import { RankingRepository } from '#/databases/repositories/ranking.repository';

@Injectable()
export class RankingService {
	constructor(private readonly rankingRepository: RankingRepository) {}

	findCurrentRanking() {
		return `This action returns all ranking`;
	}
}
