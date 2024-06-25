import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ResponseCurrentRankingDto {
	@IsNumber()
	@Expose()
	rank: number;

	@IsInt()
	@IsOptional()
	@Expose()
	rankChange: number;

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
