import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsString } from 'class-validator';

export class RequestCreateWordDto {
	@ApiProperty({
		description: '단어의 이름입니다.',
		type: String,
	})
	@IsString()
	name: string;

	@ApiProperty({
		description: '단어에 대한 설명입니다.',
		type: String,
	})
	@IsString()
	description: string;

	@ApiProperty({
		description: '단어의 발음 기호 목록입니다.',
		type: Array<string>,
	})
	@IsArray()
	diacritic: string[];

	@ApiProperty({
		description: '단어의 올바른 발음 예시 목록입니다.',
		type: Array<string>,
	})
	@IsArray()
	pronunciation: string[];

	@ApiProperty({
		description: '단어의 잘못된 발음 예시 목록입니다.',
		type: Array<string>,
	})
	@IsArray()
	wrongPronunciations: string[];

	@ApiProperty({
		description: '단어 사용 예문입니다.',
		type: String,
	})
	@IsString()
	exampleSentence: string;
}
