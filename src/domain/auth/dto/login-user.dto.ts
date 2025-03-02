import { PickType } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { UserSchema } from '#/infrastructure/drizzle/schema';

export class RequestCreateUserDto extends PickType(UserSchema, [
	'profileImage',
]) {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	nickname: string;
}
