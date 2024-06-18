import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '#/auth/auth.module';
import { QuizSelectionRepository } from '#/databases/repositories/quiz-selection.repository';
import { SpreadSheetModule } from '#/spread-sheet/spread-sheet.module';
import { UserModule } from '#/user/user.module';
import { WordModule } from '#/word/word.module';
import { QuizResult } from '#databases/entities/quiz-result.entity';
import { QuizSelection } from '#databases/entities/quiz-selection.entity';
import { QuizResultRepository } from '#databases/repositories/quiz-result.repository';

import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([QuizResult, QuizSelection]),
		AuthModule,
		UserModule,
		WordModule,
		SpreadSheetModule,
	],
	controllers: [QuizController],
	providers: [
		// Service
		QuizService,
		// Repository
		QuizResultRepository,
		QuizSelectionRepository,
	],
})
export class QuizModule {}
