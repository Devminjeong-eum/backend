import { Module } from '@nestjs/common';

import { AuthModule } from '#/domain/auth/auth.module';
import { TextToSpeechModule } from '#/domain/text-to-speech/text-to-speech.module';
import { UserModule } from '#/domain/user/user.module';
import { WordRepository } from '#/infrastructure/drizzle/repository/word.repository';
import { SpreadSheetModule } from '#/infrastructure/spread-sheet/spread-sheet.module';

import { WordUpdateBatchService } from './service/word-update-batch.service';
import { WordService } from './service/word.service';
import { WordController } from './word.controller';
import { WordSearchRepository } from '#/infrastructure/drizzle/repository/word-search.repository';

@Module({
	imports: [
		SpreadSheetModule,
		AuthModule,
		UserModule,
		TextToSpeechModule,
	],
	controllers: [WordController],
	providers: [
		// Service
		WordService,
		WordUpdateBatchService,
		// Repository
		WordRepository,
		WordSearchRepository,
	],
	exports: [WordService, WordRepository],
})
export class WordModule {}
