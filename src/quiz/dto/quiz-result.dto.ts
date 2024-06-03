import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform, Type } from 'class-transformer';
import {
	IsBoolean,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	Length,
} from 'class-validator';

export class RequestQuizResultDto {
	@IsOptional()
	@IsUUID()
	userId?: string;

	@IsString()
	@Length(6)
	quizResultId: string;
}

class QuizResultWord {
	@IsUUID()
	@Transform(({ obj }) => obj.word_id)
	@Expose({ name: 'wordId' })
	wordId: string;

	@IsString()
	@Transform(({ obj }) => obj.word_name)
	@Expose({ name: 'name' })
	name: string;

	@IsString()
	@Transform(({ obj }) => obj.word_pronunciation[0])
	@Expose({ name: 'pronunciation' })
	pronunciation: string;

	@IsString()
	@Transform(({ obj }) => obj.word_diacritic[0])
	@Expose({ name: 'diacritic' })
	diacritic: string;

	@IsBoolean()
	@Transform(({ obj }) => obj.islike)
	@Expose({ name: 'isLike' })
	isLike: boolean;
}

export class ResponseQuizResultDto {
	@IsString()
	@Length(6)
	@Expose()
	@ApiProperty()
	quizResultId: string;

	@IsNumber()
	@Expose()
	@ApiProperty()
	score: number;

	@Type(() => QuizResultWord)
	@Expose({ name: 'correctWords' })
	@ApiProperty()
	correctWords: QuizResultWord[];

	@Type(() => QuizResultWord)
	@Expose({ name: 'incorrectWords' })
	@ApiProperty()
	incorrectWords: QuizResultWord[];
}
