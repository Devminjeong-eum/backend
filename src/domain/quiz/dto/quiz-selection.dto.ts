import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsArray, IsNotEmpty, IsString } from 'class-validator';

import { QuizSelectionSchema } from '#/infrastructure/drizzle/schema/quiz-selection.schema';
export class ResponseQuizSelectionDto extends PickType(QuizSelectionSchema, [
	'correct',
	'wordId',
]) {
	@IsString({ each: true })
	@IsArray()
	@ApiProperty({ type: String, isArray: true, required: true })
	selections: string[];

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ type: String, required: true })
	name: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ type: String, required: true })
	diacritic: string;
}
