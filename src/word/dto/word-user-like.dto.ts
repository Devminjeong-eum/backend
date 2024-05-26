import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';
import { IsArray, IsString, IsUUID } from 'class-validator';

import { PaginationOptionDto } from '#/common/dto/pagination.dto';

export class RequestWordUserLikeDto extends PaginationOptionDto {
	@IsUUID()
	userId: string;
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
