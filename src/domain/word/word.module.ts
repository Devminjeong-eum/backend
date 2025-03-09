import { Module } from '@nestjs/common';

import { AuthModule } from '#/domain/auth/auth.module';
import { TextToSpeechModule } from '#/domain/text-to-speech/text-to-speech.module';
import { UserModule } from '#/domain/user/user.module';
import { WordSearchRepository } from '#/infrastructure/drizzle/repository/word-search.repository';
import { WordRepository } from '#/infrastructure/drizzle/repository/word.repository';
import { SpreadSheetModule } from '#/infrastructure/spread-sheet/spread-sheet.module';

import { WordViewModule } from '../word-view/word-view.module';

import { WordUpdateBatchService } from './service/word-update-batch.service';
import { WordService } from './service/word.service';
import { WordController } from './word.controller';

@Module({
	imports: [
		SpreadSheetModule,
		AuthModule,
		UserModule,
		TextToSpeechModule,
		WordViewModule,
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
