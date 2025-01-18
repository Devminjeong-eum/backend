import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ResponseCurrentRankingDto {
	@IsNumber()
	@Expose()
	@ApiProperty()
	rank: number;

	@IsInt()
	@IsOptional()
	@Expose()
	@ApiProperty()
	rankChange: number;

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
