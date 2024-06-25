import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform, Type } from 'class-transformer';
import { IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';

export class RequestRankingByYearDto {
	@Transform(({ value }) => parseInt(value, 10))
	@IsNumber()
	@Min(2024) // NOTE : 서비스 시작 년도 2024년도
	@Max(new Date().getFullYear())
	year: number;
}

export class ResponseRankingByYearDto {
	@Type(() => Number) 
	@Expose()
	@ApiProperty()
	rank: number;

	@IsUUID()
	@Transform(({ obj }) => obj.word_id)
	@Expose()
	@ApiProperty()
	id: string;

	@IsString()
	@Transform(({ obj }) => obj.word_name)
	@Expose()
	@ApiProperty()
	name: string;

	@IsString()
	@Transform(({ obj }) => obj.word_description)
	@Expose({ name: 'description' })
	@ApiProperty()
	description: string;

	@IsString()
	@Transform(({ obj }) => obj.word_diacritic[0])
	@Expose({ name: 'diacritic' })
	@ApiProperty()
	diacritic: string;

	@IsString()
	@Transform(({ obj }) => obj.word_pronunciation[0])
	@Expose({ name: 'pronunciation' })
	@ApiProperty()
	pronunciation: string;
}
