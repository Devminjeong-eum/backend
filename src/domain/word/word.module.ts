import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '#/domain/auth/auth.module';
import { TextToSpeechModule } from '#/domain/text-to-speech/text-to-speech.module';
import { UserModule } from '#/domain/user/user.module';
import { WordSearchModule } from '#/domain/word-search/word-search.module';
import { Word } from '#/infrastructure/database/entities/word.entity';
import { WordRepository } from '#/infrastructure/database/repositories/word.repository';
import { SpreadSheetModule } from '#/infrastructure/spread-sheet/spread-sheet.module';

import { WordService } from './service/word.service';
import { WordController } from './word.controller';

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
