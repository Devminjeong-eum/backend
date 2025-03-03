import {
	ExecutionContext,
	InternalServerErrorException,
	UnauthorizedException,
	createParamDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RequestWithUser } from '../guard/user-role';
import { USE_ROLE_GUARD_KEY } from '../guard/user-role/user-role-guard.decorator';

export const User = createParamDecorator(
	(_data: unknown, context: ExecutionContext) => {
		const reflector = new Reflector();
		const request = context.switchToHttp().getRequest<RequestWithUser>();

		const isUseRoleGuard = reflector.getAllAndOverride<boolean>(
			USE_ROLE_GUARD_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (!isUseRoleGuard) {
			throw new InternalServerErrorException(
				'User 데코레이터는 UseRoleGuard 데코레이터 이후에 선언되어야 합니다.',
			);
		}

		if (!request.user) {
			throw new UnauthorizedException(
				'요청에 유저 정보가 존재하지 않습니다.',
			);
		}

		return request.user;
	},
);
