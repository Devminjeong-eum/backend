import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';

import { PaginationOptionDto } from '#/common/dto/pagination.dto';

export class RequestWordListDto extends PaginationOptionDto {
	@IsOptional()
	@IsUUID()
	userId?: string;
}

export class ResponseWordListDto {
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

	@IsBoolean()
	@Transform(({ obj }) => obj.islike)
	@Expose({ name: 'isLike' })
	@ApiProperty()
	isLike: boolean;
}
