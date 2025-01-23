import { WordSchema } from '#/infrastructure/drizzle/schema/word.schema';
import { ApiProperty, PickType } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';
import {
	IsArray,
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

class QuizResultWord extends PickType(WordSchema, [
	'name',
	'pronunciation',
	'diacritic',
]) {
	@IsUUID()
	wordId: string;

	@IsBoolean()
	isLike: boolean;
}

export class ResponseQuizResultDto {
	@IsString()
	@Length(6)
	@Expose()
	@ApiProperty()
	quizResultId: string;

	@IsString()
	@Length(6)
	@Expose()
	@ApiProperty()
	userName: string;

	@IsNumber()
	@Expose()
	@ApiProperty()
	score: number;

	@Type(() => QuizResultWord)
	@IsArray()
	@ApiProperty({ type: [QuizResultWord], isArray: true })
	correctWords: QuizResultWord[];

	@Type(() => QuizResultWord)
	@IsArray()
	@ApiProperty({  type: [QuizResultWord], isArray: true })
	incorrectWords: QuizResultWord[];
}
