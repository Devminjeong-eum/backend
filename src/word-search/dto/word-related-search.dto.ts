import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';
import { IsString, IsUUID, Matches } from 'class-validator';

import { PaginationOptionDto } from '#/common/dto/pagination.dto';

export class RequestWordRelatedSearchDto extends PaginationOptionDto {
	@IsString()
	@Matches(/^[a-zA-Z0-9]+$/)
	@ApiProperty({
		description: '입력한 단어 키워드',
	})
	keyword: string;
}

export class ResponseWordRelatedSearchDto {
	@IsUUID()
	@Transform(({ obj }) => obj.word_id)
	@Expose({ name: 'id' })
	@ApiProperty({
		description: '단어 Id',
	})
	id: string;

	@IsString()
	@Transform(({ obj }) => obj.word_name)
	@Expose({ name: 'name' })
	@ApiProperty({
		description: '단어 명',
	})
	name: string;

	@IsString()
	@Transform(({ obj }) => obj.word_diacritic[0])
	@Expose({ name: 'diacritic' })
	@ApiProperty({
		description: '단어 설명',
	})
	diacritic: string;
}
