import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';
import { IsArray, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

import { PaginationOptionDto } from '#/common/dto/pagination.dto';

import {
	SORTING_WORD_OPTION,
	type SortingWordListOption,
} from '../interface/word-list-sorting.interface';

export class RequestWordUserLikeDto extends PaginationOptionDto {
	@IsUUID()
	userId: string;

	@IsOptional()
	@IsIn(SORTING_WORD_OPTION)
	@ApiProperty({
		type: 'enum',
		enum: SORTING_WORD_OPTION,
	})
	sorting: SortingWordListOption = 'CREATED';
}

export class ResponseWordUserLikeDto {
	@IsUUID()
	@ApiProperty({
		type: String,
	})
	id: string;

	@IsString()
	@ApiProperty({
		type: String,
	})
	name: string;

	@IsString()
	@ApiProperty({
		type: String,
	})
	description: string;

	@IsArray()
	@ApiProperty({
		type: String,
		isArray: true,
	})
	diacritic: string[];

	@IsArray()
	@ApiProperty({
		type: String,
		isArray: true,
	})
	pronunciation: string[];

	@Exclude()
	createdAt: Date;
}
