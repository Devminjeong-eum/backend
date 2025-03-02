import { PickType } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { UserSchema } from '#/infrastructure/drizzle/schema';

export class RequestLoginUserDto extends PickType(UserSchema, [
	'profileImage',
]) {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	nickname: string;
}
