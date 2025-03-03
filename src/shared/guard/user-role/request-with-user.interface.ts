import type { Request } from 'express';

import { UserRole } from '#/infrastructure/drizzle/constant/user-role.constant';

export interface GuestUserData {
	id: null;
	name: null;
	role: UserRole.GUEST;
}

export interface RegisterUserData {
	id: string;
	name: string;
	role: UserRole;
}

export interface RequestWithUser extends Request {
	user?: RegisterUserData | GuestUserData;
}

export type UserData<IsAllowGuest = false> = IsAllowGuest extends true
	? GuestUserData | RegisterUserData
	: RegisterUserData;
