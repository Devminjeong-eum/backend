import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsUUID } from 'class-validator';

export class RequestChangeNicknameDto {
	@IsUUID()
	@ApiProperty({
		description: '수정하고자 하는 User UUID'
	})
	userId: string;

	@IsNotEmpty()
	@ApiProperty({
		description: '새롭게 적용할 유저 닉네임'
	})
	nickname: string;
}
