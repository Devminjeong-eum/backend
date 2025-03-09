import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRole } from '#/infrastructure/drizzle/constant/user-role.constant';
import type { RequestWithUser } from '#/shared/guard/user-role';

import { USE_WORD_VIEWER_ID_INTERCEPTOR } from '../interceptor/word-viewer-id';
import type { RequestWithViewerId } from '../interface/request-with-viewer.interface';

export const ViewerId = createParamDecorator(
	(_data: unknown, context: ExecutionContext) => {
		const reflector = new Reflector();
		const request = context
			.switchToHttp()
			.getRequest<RequestWithUser & RequestWithViewerId>();

		const isWordViewerIdInterceptor = reflector.getAllAndOverride<boolean>(
			USE_WORD_VIEWER_ID_INTERCEPTOR,
			[context.getHandler(), context.getClass()],
		);

		if (!isWordViewerIdInterceptor) {
			throw new Error(
				'ViewerId 데코레이터는 UseWordViewerIdInterceptor 이후에 선언되어야 합니다.',
			);
		}

		const viewerId =
			request.user.role === UserRole.GUEST
				? request.viewerId
				: request.user.id;

		return viewerId;
	},
);
