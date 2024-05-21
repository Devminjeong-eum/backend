import { ApiProperty } from '@nestjs/swagger';

import { IsUUID } from 'class-validator';

export class RequestCreateLikeDto {
	@ApiProperty({
		description: '좋아요를 누른 단어의 ID 입니다.',
		type: String,
	})
	@IsUUID()
	wordId: string;
}
