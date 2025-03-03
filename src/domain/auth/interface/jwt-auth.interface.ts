import { UserRole } from '#/infrastructure/drizzle/constant/user-role.constant';

export interface AuthTokenPayload {
	exp: number;
	iat: number;
	id: string;
	name: string;
	role: UserRole;
}
