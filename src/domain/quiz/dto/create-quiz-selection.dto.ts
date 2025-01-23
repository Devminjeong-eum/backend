import { PickType } from '@nestjs/swagger';

import { QuizSelectionSchema } from '#/infrastructure/drizzle/schema/quiz-selection.schema';

export class RequestCreateQuizSelectDto extends PickType(QuizSelectionSchema, [
	'correct',
	'incorrectList',
]) {}
