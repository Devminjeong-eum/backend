import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { AuthenticatedUser } from '#/auth/decorator/auth.decorator';
import { AuthenticationGuard } from '#/auth/guard/auth.guard';
import { User } from '#databases/entities/user.entity';

import { RequestCreateQuizResultDto } from './dto/create-quiz-result.dto';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
	constructor(private readonly quizService: QuizService) {}

	@UseGuards(AuthenticationGuard)
	@Post('/result')
	async createQuizResult(
		@AuthenticatedUser() user: User,
		@Body('correctWordIds') correctWordIds: string[],
		@Body('incorrectWordIds') incorrectWordIds: string[],
	) {
		const createQuizResultDto = plainToInstance(
			RequestCreateQuizResultDto,
			{ userId: user.id, correctWordIds, incorrectWordIds },
		);
		return this.quizService.createQuizResult(createQuizResultDto);
	}
}
