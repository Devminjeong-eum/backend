import { Expose, Transform } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';

export class RequestWordDetailDto {
	@IsUUID()
	@IsOptional()
	userId?: string;

	@IsUUID()
	wordId: string;
}

export class ResponseWordDetailDto {
	@IsUUID()
	@Transform(({ obj }) => obj.word_id)
	@Expose({ name: 'id' })
	id: string;

	@IsString()
	@Transform(({ obj }) => obj.word_name)
	@Expose({ name: 'name' })
	name: string;

	@IsString()
	@Transform(({ obj }) => obj.word_description)
	@Expose({ name: 'description' })
	description: string;

	@IsArray()
	@Transform(({ obj }) => obj.word_diacritic)
	@Expose({ name: 'diacritic' })
	diacritic: string[];

	@IsArray()
	@Transform(({ obj }) => obj.word_pronunciation)
	@Expose({ name: 'pronunciation' })
	pronunciation: string[];

	
	@IsArray()
	@Transform(({ obj }) => obj.word_wrongPronunciations)
	@Expose({ name: 'wrongPronunciation' })
	wrongPronunciation: string[];

	@IsString()
	@Transform(({ obj }) => obj.word_exampleSentence)
	@Expose({ name: 'exampleSentence' })
	exampleSentence: string;

	@IsBoolean()
	@Transform(({ obj }) => obj.islike)
	@Expose({ name: 'isLike' })
	isLike: boolean;

	@IsNumber()
	@Transform(({ obj }) => Number(obj.likecount))
	@Expose({ name: 'likeCount' })
	likeCount: number;
}
