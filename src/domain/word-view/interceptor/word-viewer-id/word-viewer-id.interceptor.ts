import type {
	CallHandler,
	ExecutionContext,
	NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { v4 as uuidv4 } from 'uuid';

import type { RequestWithViewerId } from '#/domain/word-view/interface/request-with-viewer.interface';
import { UserRole } from '#/infrastructure/drizzle/constant/user-role.constant';
import {
	type RequestWithUser,
	USE_ROLE_GUARD_KEY,
} from '#/shared/guard/user-role';

@Injectable()
export class WordViewerIdInterceptor implements NestInterceptor {
	constructor(private readonly reflector: Reflector) {}

	intercept(context: ExecutionContext, next: CallHandler) {
		const request = context
			.switchToHttp()
			.getRequest<RequestWithViewerId & RequestWithUser>();
		const response = context.switchToHttp().getResponse();

		const isRoleGuardExists = this.reflector.getAllAndOverride<boolean>(
			USE_ROLE_GUARD_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (!isRoleGuardExists) {
			throw new Error('Role Guard is not defined');
		}

		const isGuest = request.user?.role === UserRole.GUEST;

		if (!isGuest) {
			return next.handle();
		}

		let viewerId = request.cookies?.viewerId;

		if (!viewerId) {
			viewerId = uuidv4();
			response.cookie('viewerId', viewerId, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 1000 * 60 * 60 * 24 * 7,
				sameSite: 'strict',
			});
		}

		request.viewerId = viewerId;

		return next.handle();
	}
}
