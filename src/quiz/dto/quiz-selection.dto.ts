import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

const shuffle = (array: Array<unknown>) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j: number = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

export class ResponseQuizSelectionDto {
	@IsString()
	@Transform(({ obj }) => obj.quizSelection_correct)
	@Expose()
	@ApiProperty()
	correct: string;

	@IsArray()
	@Transform(({ obj }) =>
		shuffle([
			...obj.quizSelection_incorrectList,
			obj.quizSelection_correct,
		]),
	)
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
