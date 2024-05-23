import { Module } from '@nestjs/common';

import { AuthModule } from '#/auth/auth.module';
import { QuizResultRepository } from '#databases/repositories/quizResult.repository';
import { WordRepository } from '#databases/repositories/word.repository';

import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

@Module({
	imports: [AuthModule],
	controllers: [QuizController],
	providers: [
		// Service
		QuizService,
		// Repository
		QuizResultRepository,
		WordRepository,
	],
})
export class QuizModule {}
