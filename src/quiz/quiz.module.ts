import { Module } from '@nestjs/common';

import { QuizResultRepository } from '#databases/repositories/quizResult.repository';

import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

@Module({
	controllers: [QuizController],
	providers: [
		// Service
		QuizService,
		// Repository
		QuizResultRepository,
	],
})
export class QuizModule {}
