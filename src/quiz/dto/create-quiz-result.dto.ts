import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';
import { IsArray, IsUUID, MaxLength } from 'class-validator';

export class RequestCreateQuizResultDto {
	@IsArray()
	@IsUUID(undefined, { each: true })
	@ApiProperty({
		description: '정답으로 처리된 단어 ID 목록',
	})
	correctWordIds: string[];

	@IsArray()
	@IsUUID(undefined, { each: true })
	@ApiProperty({
		description: '오답으로 처리된 단어 ID 목록',
	})
	incorrectWordIds: string[];
}

export class ResponseCreateQuizResultDto {
	@IsUUID()
	@Transform(({ obj }) => obj.id)
	@Expose()
	@ApiProperty()
	quizResultId: string;

	@IsArray()
	@IsUUID()
	@MaxLength(10)
	@Expose()
	@ApiProperty()
	correctWordIds: string[];

	@IsArray()
	@IsUUID()
	@MaxLength(10)
	@Expose()
	@ApiProperty()
	incorrectWordIds: string[];
}
