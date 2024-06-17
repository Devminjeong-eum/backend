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

import { PaginationOptionDto } from '#/common/dto/pagination.dto';

import {
	SORTING_WORD_OPTION,
	type SortingWordListOption,
} from '../interface/word-list-sorting.interface';

export class RequestWordListDto extends PaginationOptionDto {
	@IsOptional()
	@IsString()
	userId?: string;

	@IsOptional()
	@IsIn(SORTING_WORD_OPTION)
	@ApiProperty({
		type: 'enum',
		enum: SORTING_WORD_OPTION,
	})
	sorting: SortingWordListOption = 'CREATED';
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

	@IsNumber()
	@Transform(({ obj }) => Number(obj.likecount))
	@Expose({ name: 'likeCount' })
	@ApiProperty()
	likeCount: number;
}
