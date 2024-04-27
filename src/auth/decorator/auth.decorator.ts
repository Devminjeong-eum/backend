import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthenticatedUser = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();
		return request.user;
	},
);
