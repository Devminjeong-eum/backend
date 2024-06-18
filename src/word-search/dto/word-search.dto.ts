import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsOptional,
	IsString,
	IsUUID,
	Matches,
	MinLength,
} from 'class-validator';

import { PaginationOptionDto } from '#/common/dto/pagination.dto';

export class RequestWordSearchDto extends PaginationOptionDto {
	@IsOptional()
	@IsUUID()
	userId?: string;

	@IsString()
	@Matches(/^[a-zA-Z0-9]+$/)
	@MinLength(3)
	@ApiProperty({
		description: '검색할 단어 키워드',
		type: String,
		minLength: 3,
	})
	keyword: string;
}

export class ResponseWordSearchDto {
	@IsUUID()
	@Transform(({ obj }) => obj.word_id)
	@Expose({ name: 'id' })
	@ApiProperty({
		description: '단어 Id',
		type: String,
	})
	id: string;

	@IsString()
	@Transform(({ obj }) => obj.word_name)
	@Expose({ name: 'name' })
	@ApiProperty({
		description: '단어 명',
		type: String,
	})
	name: string;

	@IsString()
	@Transform(({ obj }) => obj.word_description)
	@Expose({ name: 'description' })
	@ApiProperty({
		description: '단어 설명',
		type: String,
	})
	description: string;

	@IsArray()
	@Transform(({ obj }) => obj.word_diacritic)
	@Expose({ name: 'diacritic' })
	@ApiProperty({
		description: '단어 발음 기호',
		type: String,
		isArray: true,
	})
	diacritic: string[];

	@IsArray()
	@Transform(({ obj }) => obj.word_pronunciation)
	@Expose({ name: 'pronunciation' })
	@ApiProperty({
		description: '올바른 발음 목록',
		type: String,
		isArray: true,
	})
	pronunciation: string[];

	@IsBoolean()
	@Transform(({ obj }) => obj.islike)
	@Expose({ name: 'isLike' })
	@ApiProperty({
		description: '유저 좋아요 여부 (비로그인 일 시 false)',
		type: Boolean,
	})
	isLike: boolean;
}
