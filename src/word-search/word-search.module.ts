import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '#/auth/auth.module';
import { WordSearch } from '#/databases/entities/wordSearch.entity';
import { WordSearchRepository } from '#/databases/repositories/wordSearch.repository';
import { UserModule } from '#/user/user.module';

import { WordSearchController } from './word-search.controller';
import { WordSearchService } from './word-search.service';

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
