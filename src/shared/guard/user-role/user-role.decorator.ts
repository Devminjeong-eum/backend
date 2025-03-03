import { SetMetadata } from '@nestjs/common';

import type { UserRole } from '#/infrastructure/drizzle/constant/user-role.constant';

export const USER_ROLES_KEY = Symbol('USER_ROLE');
export const UserRoles = (role: UserRole) => SetMetadata(USER_ROLES_KEY, role);
