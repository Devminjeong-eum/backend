import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';
import { IsAlpha, IsString, IsUUID } from 'class-validator';

import { PaginationOptionDto } from '#/common/dto/pagination.dto';

export class RequestWordRelatedSearchDto extends PaginationOptionDto {
	@IsString()
	@IsAlpha()
	@ApiProperty({
		description: '입력한 단어 키워드',
	})
	keyword: string;
}

export class ResponseWordRelatedSearchDto {
	@IsUUID()
	@Expose()
	id: string;

	@IsString()
	name: string;

	@IsString()
	@Transform(({ value }) => value[0])
	diacritic: string;
}
