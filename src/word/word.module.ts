import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Word } from '#databases/entities/word.entity';
import { WordRepository } from '#databases/repositories/word.repository';

import { WordController } from './word.controller';
import { WordService } from './word.service';

@Module({
	imports: [TypeOrmModule.forFeature([Word])],
	controllers: [WordController],
	providers: [
		// Service
		WordService,
		// Repository
		WordRepository,
	],
})
export class WordModule {}