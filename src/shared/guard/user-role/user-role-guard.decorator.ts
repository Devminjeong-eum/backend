import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { UserRole } from '#/infrastructure/drizzle/constant/user-role.constant';

import { UserRoles } from './user-role.decorator';
import { UserRoleGuard } from './user-role.guard';

export const USE_ROLE_GUARD_KEY = Symbol('USE_ROLE_GUARD');

export const UseRoleGuard = (role: UserRole) => {
	return applyDecorators(
		SetMetadata(USE_ROLE_GUARD_KEY, true),
		UseGuards(UserRoleGuard),
		UserRoles(role),
	);
};
