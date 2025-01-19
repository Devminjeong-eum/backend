import { Module } from '@nestjs/common';

import { AuthModule } from '#/domain/auth/auth.module';
import { QuizResultRepository } from '#/infrastructure/drizzle/repository/quiz-result.repository';
import { QuizSelectionRepository } from '#/infrastructure/drizzle/repository/quiz-selection.repository';
import { SpreadSheetModule } from '#/infrastructure/spread-sheet/spread-sheet.module';

import { QuizController } from './quiz.controller';
import { QuizBatchUpdateService } from './service/quiz-batch-update.service';
import { QuizResultService } from './service/quiz-result.service';
import { QuizSelectionService } from './service/quiz-selection.service';
import { WordRepository } from '#/infrastructure/drizzle/repository/word.repository';
import { UserRepository } from '#/infrastructure/drizzle/repository/user.repository';

@Module({
	imports: [AuthModule, SpreadSheetModule],
	controllers: [QuizController],
	providers: [
		// Service
		QuizResultService,
		QuizSelectionService,
		QuizBatchUpdateService,
		// Repository
		QuizResultRepository,
		QuizSelectionRepository,
		WordRepository,
		UserRepository,
	],
})
export class QuizModule {}
