import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsString, Length } from 'class-validator';

import { QuizResultSchema } from '#/infrastructure/drizzle/schema/quiz-result.schema';

export class RequestCreateQuizResultDto extends PickType(QuizResultSchema, [
	'correctWordIds',
	'incorrectWordIds',
]) {}

export class ResponseCreateQuizResultDto extends PickType(QuizResultSchema, [
	'correctWordIds',
	'incorrectWordIds',
]) {
	@IsString()
	@Length(6)
	@ApiProperty()
	quizResultId: string;
}
