import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '#/auth/auth.module';
import { SpreadSheetModule } from '#/spread-sheet/spread-sheet.module';
import { TextToSpeechModule } from '#/text-to-speech/text-to-speech.module';
import { UserModule } from '#/user/user.module';
import { WordSearchModule } from '#/word-search/word-search.module';
import { Word } from '#databases/entities/word.entity';
import { WordRepository } from '#databases/repositories/word.repository';

import { WordController } from './word.controller';
import { WordService } from './word.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Word]),
		SpreadSheetModule,
		AuthModule,
		UserModule,
		WordSearchModule,
		TextToSpeechModule,
	],
	controllers: [WordController],
	providers: [
		// Service
		WordService,
		// Repository
		WordRepository,
	],
	exports: [WordService, WordRepository],
})
export class WordModule {}
