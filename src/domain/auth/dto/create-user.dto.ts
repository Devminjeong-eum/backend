import { PickType } from '@nestjs/mapped-types';

import { UserSchema } from '#/infrastructure/drizzle/schema/user.schema';

export class RequestCreateUserDto extends PickType(UserSchema, [
	'socialPlatformId',
	'profileImage',
	'name',
	'socialType',
]) {}
