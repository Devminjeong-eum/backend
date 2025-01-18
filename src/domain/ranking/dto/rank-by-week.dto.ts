import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform, Type } from 'class-transformer';
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
	@Type(() => Number)
	@Expose()
	@ApiProperty()
	rank: number;

	@IsUUID()
	@Transform(({ obj }) => obj.wordId)
	@Expose()
	@ApiProperty()
	id: string;

	@IsString()
	@Transform(({ obj }) => obj.wordName)
	@Expose()
	@ApiProperty()
	name: string;

	@IsString()
	@Transform(({ obj }) => obj.wordDescription)
	@Expose({ name: 'description' })
	@ApiProperty()
	description: string;

	@IsString()
	@Transform(({ obj }) => obj.wordDiacritic[0])
	@Expose({ name: 'diacritic' })
	@ApiProperty()
	diacritic: string;

	@IsString()
	@Transform(({ obj }) => obj.wordPronunciation[0])
	@Expose({ name: 'pronunciation' })
	@ApiProperty()
	pronunciation: string;
}
