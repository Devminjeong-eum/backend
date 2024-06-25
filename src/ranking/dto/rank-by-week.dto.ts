import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';

export class RequestRankingByWeekDto {
	@Transform(({ value }) => parseInt(value, 10))
	@IsNumber()
	@Min(2024) // NOTE : 서비스 시작 년도 2024년도
	@Max(new Date().getFullYear())
	year: number;

	@IsNumber()
	@Min(1)
	@Max(53)
	week: number;
}

export class ResponseRankingByWeekDto {
	@IsNumber()
	@Expose()
	rank: number;

	@IsUUID()
	@Transform(({ obj }) => obj.word.id)
	@Expose()
	@ApiProperty()
	id: string;

	@IsString()
	@Transform(({ obj }) => obj.word.name)
	@Expose()
	@ApiProperty()
	name: string;

	@IsString()
	@Transform(({ obj }) => obj.word.description)
	@Expose({ name: 'description' })
	@ApiProperty()
	description: string;

	@IsString()
	@Transform(({ obj }) => obj.word.diacritic[0])
	@Expose({ name: 'diacritic' })
	diacritic: string;
}
