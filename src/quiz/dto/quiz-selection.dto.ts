import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class ResponseQuizSelectionDto {
	@IsString()
	@Transform(({ obj }) => obj.quizSelection_correct)
	@Expose()
	@ApiProperty()
	correct: string;

	@IsArray()
	@Transform(({ obj }) => [
		...obj.quizSelection_incorrectList,
		obj.quizSelection_correct,
	])
	@Expose({ name: 'selections' })
	@ApiProperty()
	selections: string[];

	@IsString()
	@Transform(({ obj }) => obj.word_id)
	@Expose()
	@ApiProperty()
	wordId: string;

	@IsString()
	@Transform(({ obj }) => obj.word_name)
	@Expose()
	@ApiProperty()
	name: string;

	@IsString()
	@Transform(({ obj }) => obj.word_diacritic[0])
	@Expose()
	@ApiProperty()
	diacritic: string;
}
