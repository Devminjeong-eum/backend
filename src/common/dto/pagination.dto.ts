import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, Max, Min } from 'class-validator';

export class PaginationDto<T> {
	constructor(data: T[], meta: PaginationMetaDto) {
		this.data = data;
		this.page = meta.page;
		this.limit = meta.limit;
		this.isLast = meta.isLast;
		this.totalCount = meta.totalCount;
	}

	@ApiProperty({
		description: '조회할 페이지',
		type: Number,
		required: false,
		default: 1,
		minimum: 1,
	})
	@Expose()
	@IsInt()
	@Min(1)
	page: number;

	@ApiProperty({
		description: '페이지 당 제공할 데이터 수량',
		type: Number,
		required: false,
		default: 1,
		minimum: 1,
	})
	@Expose()
	@IsInt()
	@Min(1)
	@Max(50)
	limit: number;

	@ApiProperty({
		description: '현재 요청한 페이지가 마지막인지를 판별하는 Flag',
		type: Boolean,
	})
	@Expose()
	@IsBoolean()
	isLast: boolean;

	@ApiProperty({
		description: '요청 가능한 페이지의 사이즈',
		type: Number,
	})
	@Expose()
	@IsInt()
	@Min(1)
	pageSize: number;

	@ApiProperty({
		description: '제공 가능한 데이터의 총합',
		type: Number,
	})
	@Expose()
	@IsInt()
	@Min(0)
	totalCount: number;

	@ApiProperty({
		type: 'generic',
		isArray: true,
	})
	@Expose()
	@IsArray()
	data: T[];
}

export class PaginationMetaDto {
	page: number;

	limit: number;

	skip: number;

	totalCount: number;

	pageSize: number;

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
		this.skip = (this.page - 1) * this.limit;
		this.totalCount = totalCount;
		this.pageSize = Math.ceil(totalCount / paginationOption.limit);
		this.isLast = (this.page + 1) * this.limit >= totalCount;
	}
}

export class PaginationOptionDto {
	@ApiProperty({
		description: '조회할 페이지',
		type: Number,
		required: false,
		default: 1,
		minimum: 1,
	})
	@Expose()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number = 1;

	@ApiProperty({
		description: '페이지 당 제공할 데이터 수량',
		type: Number,
		required: false,
		default: 1,
		minimum: 1,
		maximum: 50,
	})
	@Expose()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(50)
	limit: number = 10;

	getSkip() {
		return (this.page - 1) * this.limit;
	}
}
