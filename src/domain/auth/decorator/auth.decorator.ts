import type { ExecutionContext} from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const AuthenticatedUser = createParamDecorator(
	(_data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();
		return request.user;
	},
);
