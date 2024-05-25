import { Expose, Transform } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class ResponseQuizSelectionDto {
	@IsString()
	@Transform(({ obj }) => obj.quizSelection_correct)
	@Expose()
	correct: string;

	@IsArray()
	@Transform(({ obj }) => [
		...obj.quizSelection_incorrectList,
		obj.quizSelection_correct,
	])
	@Expose({ name: 'selections' })
	selections: string[];

	@IsString()
	@Transform(({ obj }) => obj.word_id)
	@Expose()
	wordId: string;

	@IsString()
	@Transform(({ obj }) => obj.word_name)
	@Expose()
	name: string;

	@IsString()
	@Transform(({ obj }) => obj.word_diacritic[0])
	@Expose()
	diacritic: string;
}
