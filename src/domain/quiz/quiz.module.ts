import { Module } from '@nestjs/common';

import { QuizSelectionRepository } from '#/infrastructure/database/repositories/quiz-selection.repository';
import { AuthModule } from '#/domain/auth/auth.module';
import { QuizResultRepository } from '#/infrastructure/database/repositories/quiz-result.repository';
import { SpreadSheetModule } from '#/infrastructure/spread-sheet/spread-sheet.module';

import { QuizController } from './quiz.controller';
import { QuizResultService } from './service/quiz-result.service';
import { QuizSelectionService } from './service/quiz-selection.service';
import { QuizBatchUpdateService } from './service/quiz-batch-update.service';

@Module({
	imports: [
		AuthModule,
		SpreadSheetModule,
	],
	controllers: [QuizController],
	providers: [
		// Service
		QuizResultService,
		QuizSelectionService,
		QuizBatchUpdateService,
		// Repository
		QuizResultRepository,
		QuizSelectionRepository,
	],
})
export class QuizModule {}
