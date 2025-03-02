import { PickType } from '@nestjs/swagger';

import { QuizSelectionSchema } from '#/infrastructure/drizzle/schema';

export class RequestCreateQuizSelectDto extends PickType(QuizSelectionSchema, [
	'correct',
	'incorrectList',
]) {}
