import { PickType } from '@nestjs/mapped-types';

import { QuizSelectionSchema } from '#/infrastructure/drizzle/schema';

export class RequestUpdateQuizSelectDto extends PickType(QuizSelectionSchema, [
	'correct',
	'incorrectList',
]) {}
