import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, Max, Min } from 'class-validator';

export class PaginationDto<T> {
	constructor(data: T[], meta: PaginationMetaDto) {
		this.data = data;
		this.page = meta.limit;
		this.limit = meta.limit;
		this.isLast = meta.isLast;
		this.totalCount = meta.totalCount;
	}

	@IsInt()
	@Min(1)
	page: number;

	@IsInt()
	@Min(1)
	@Max(50)
	limit: number;

	@IsBoolean()
	isLast: boolean;

	@IsInt()
	@Min(0)
	totalCount: number;

	@IsArray()
	data: T[];
}

export class PaginationMetaDto {
	page: number;

	limit: number;

	totalCount: number;

	isLast: boolean;

	constructor({
		paginationOption,
		totalCount,
	}: {
		paginationOption: PaginationOptionDto;
		totalCount: number;
	}) {
		this.page = paginationOption.page;
		this.limit = paginationOption.limit;
		this.totalCount = totalCount;
		this.isLast = this.page * this.limit >= totalCount;
	}
}

export class PaginationOptionDto {
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number = 1;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(50)
	limit: number = 10;
}
