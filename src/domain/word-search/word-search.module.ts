import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WordSearch } from '#/infrastructure/database/entities/word-search.entity';
import { WordSearchRepository } from '#/infrastructure/database/repositories/word-search.repository';
import { AuthModule } from '#/domain/auth/auth.module';
import { UserModule } from '#/domain/user/user.module';

import { WordSearchService } from './service/word-search.service';
import { WordSearchController } from './word-search.controller';

@Module({
	imports: [TypeOrmModule.forFeature([WordSearch]), AuthModule, UserModule],
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
