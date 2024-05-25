import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '#/auth/auth.module';
import { SpreadSheetModule } from '#/spread-sheet/spread-sheet.module';
import { UserModule } from '#/user/user.module';
import { WordModule } from '#/word/word.module';
import { QuizResult } from '#databases/entities/quizResult.entity';
import { QuizSelection } from '#databases/entities/quizSelection.entity';
import { QuizResultRepository } from '#databases/repositories/quizResult.repository';
import { QuizSelectionRepository } from '#databases/repositories/quizSelection.repository';

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
