import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsIn,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';

import {
	WORD_DETAIL_SEARCH_OPTION,
	type WordDetailSearchOption,
} from '../interface/word-search-type.interface';

export class RequestWordDetailDto {
	@IsUUID()
	@IsOptional()
	userId?: string;

	@IsOptional()
	@IsIn(WORD_DETAIL_SEARCH_OPTION)
	@ApiProperty({
		type: 'enum',
		enum: WORD_DETAIL_SEARCH_OPTION,
	})
	searchType: WordDetailSearchOption = 'NAME';

	@IsString()
	@ApiProperty({
		description:
			'searchType 이 NAME 일 경우 단어 명을, ID 일 경우 단어 id 를 받습니다.',
	})
	searchValue: string;
}

export class ResponseWordDetailDto {
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
