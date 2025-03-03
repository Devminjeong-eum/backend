import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { AuthTokenPayload } from '#/domain/auth/interface/jwt-auth.interface';
import { UserRole } from '#/infrastructure/drizzle/constant/user-role.constant';

import { RequestWithUser } from './request-with-user.interface';
import { USER_ROLES_KEY } from './user-role.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly jwtService: JwtService,
	) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest<RequestWithUser>();
		const requiredRole = this.reflector.getAllAndOverride<UserRole>(
			USER_ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (!requiredRole) {
			return this.processGuestRole(request);
		}

		return await this.checkAuthenticatedToken({ requiredRole, request });
	}

	private processGuestRole(request: RequestWithUser) {
		request.user = {
			id: null,
			name: null,
			role: UserRole.GUEST,
		};

		return true;
	}

	private async checkAuthenticatedToken({
		requiredRole,
		request,
	}: {
		requiredRole: UserRole;
		request: RequestWithUser;
	}) {
		const { accessToken, refreshToken } = request.cookies ?? {};

		if (!refreshToken) {
			throw new UnauthorizedException(
				'요청에 계정 정보가 존재하지 않습니다. 로그인을 진행해주세요.',
			);
		}

		const payload = this.jwtService.verify<AuthTokenPayload>(accessToken);

		if (!payload) {
			throw new UnauthorizedException('엑세스 토큰이 유효하지 않습니다.');
		}

		if (!this.checkRole({ userRole: payload.role, requiredRole })) {
			throw new ForbiddenException(
				'해당 응답을 처리하기 위한 권한이 없습니다.',
			);
		}

		request.user = {
			id: payload.id,
			name: payload.name,
			role: payload.role,
		};

		return true;
	}

	private checkRole({
		userRole,
		requiredRole,
	}: {
		userRole: UserRole;
		requiredRole: UserRole;
	}) {
		const roleHierarchy = {
			[UserRole.ADMIN]: 2,
			[UserRole.USER]: 1,
			[UserRole.GUEST]: 0,
		};

		const userRolePriority = roleHierarchy[userRole];
		const requiredRolePriority = roleHierarchy[requiredRole];

		return userRolePriority >= requiredRolePriority;
	}
}
