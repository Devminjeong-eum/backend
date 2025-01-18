import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class ResponseUserInformationDto {
	@IsUUID()
	@Transform(({ obj }) => obj.user_id)
	@Expose()
	@ApiProperty()
	userId: string;

	@IsString()
	@Transform(({ obj }) => obj.user_name)
	@Expose()
	@ApiProperty()
	name: string;

	@IsString()
	@Transform(({ obj }) => obj.user_profileImage)
	@Expose()
	@ApiProperty()
	profileImage: string;

	@IsNumber()
	@Transform(({ obj }) => Number(obj.likecount))
	@Expose()
	@ApiProperty()
	likeCount: number;
}
