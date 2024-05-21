import { Exclude } from 'class-transformer';
import { IsArray, IsString, IsUUID } from 'class-validator';

import { PaginationOptionDto } from '#/common/dto/pagination.dto';

export class RequestWordUserLikeDto extends PaginationOptionDto {
	@IsUUID()
	userId: string;
}

export class ResponseWordUserLikeDto {
	@IsUUID()
	id: string;

	@IsString()
	name: string;

	@IsString()
	description: string;

	@IsArray()
	diacritic: string[];

	@IsArray()
	pronunciation: string[];

	@Exclude()
	createdAt: Date;
}
