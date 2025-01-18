import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuizSelectionRepository } from '#/infrastructure/database/repositories/quiz-selection.repository';
import { AuthModule } from '#/domain/auth/auth.module';
import { UserModule } from '#/domain/user/user.module';
import { WordModule } from '#/domain/word/word.module';
import { QuizResult } from '#/infrastructure/database/entities/quiz-result.entity';
import { QuizSelection } from '#/infrastructure/database/entities/quiz-selection.entity';
import { QuizResultRepository } from '#/infrastructure/database/repositories/quiz-result.repository';
import { SpreadSheetModule } from '#/infrastructure/spread-sheet/spread-sheet.module';

import { QuizController } from './quiz.controller';
import { QuizService } from './service/quiz.service';

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
