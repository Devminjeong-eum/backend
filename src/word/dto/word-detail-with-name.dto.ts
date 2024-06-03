import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';

export class RequestWordDetailWithNameDto {
	@IsUUID()
	@IsOptional()
	userId?: string;

	@IsString()
	name: string;
}

export class ResponseWordDetailWithNameDto {
	@IsUUID()
	@Transform(({ obj }) => obj.word_id)
	@Expose({ name: 'id' })
	@ApiProperty()
	id: string;

	@IsString()
	@Transform(({ obj }) => obj.word_name)
	@Expose({ name: 'name' })
	@ApiProperty()
	name: string;

	@IsString()
	@Transform(({ obj }) => obj.word_description)
	@Expose({ name: 'description' })
	@ApiProperty()
	description: string;

	@IsArray()
	@Transform(({ obj }) => obj.word_diacritic)
	@Expose({ name: 'diacritic' })
	@ApiProperty()
	diacritic: string[];

	@IsArray()
	@Transform(({ obj }) => obj.word_pronunciation)
	@Expose({ name: 'pronunciation' })
	@ApiProperty()
	pronunciation: string[];

	@IsArray()
	@Transform(({ obj }) => obj.word_wrongPronunciations)
	@Expose({ name: 'wrongPronunciation' })
	@ApiProperty()
	wrongPronunciation: string[];

	@IsString()
	@Transform(({ obj }) => obj.word_exampleSentence)
	@Expose({ name: 'exampleSentence' })
	@ApiProperty()
	exampleSentence: string;

	@IsBoolean()
	@Transform(({ obj }) => obj.islike)
	@Expose({ name: 'isLike' })
	@ApiProperty()
	isLike: boolean;

	@IsNumber()
	@Transform(({ obj }) => Number(obj.likecount))
	@Expose({ name: 'likeCount' })
	@ApiProperty()
	likeCount: number;
}
