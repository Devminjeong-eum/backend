import { Module } from '@nestjs/common';

import { AuthModule } from '#/domain/auth/auth.module';
import { UserModule } from '#/domain/user/user.module';
import { WordSearchRepository } from '#/infrastructure/drizzle/repository/word-search.repository';

import { WordSearchService } from './service/word-search.service';
import { WordSearchController } from './word-search.controller';

@Module({
	imports: [AuthModule, UserModule],
	controllers: [WordSearchController],
	providers: [
		// Service
		WordSearchService,
		// Repository
		WordSearchRepository,
	],
	exports: [WordSearchService, WordSearchRepository],
})
export class WordSearchModule {}
