import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '#/auth/auth.module';
import { UserModule } from '#/user/user.module';
import { WordModule } from '#/word/word.module';
import { QuizResult } from '#databases/entities/quizResult.entity';
import { QuizResultRepository } from '#databases/repositories/quizResult.repository';

import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([QuizResult]),
		AuthModule,
		UserModule,
		WordModule,
	],
	controllers: [QuizController],
	providers: [
		// Service
		QuizService,
		// Repository
		QuizResultRepository,
	],
})
export class QuizModule {}
