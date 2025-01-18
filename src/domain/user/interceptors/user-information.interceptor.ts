import type {
	CallHandler,
	ExecutionContext,
	NestInterceptor} from '@nestjs/common';
import {
	Injectable
} from '@nestjs/common';

import type { Response } from 'express';

import { AuthService } from '#/domain/auth/service/auth.service';
import { UserRepository } from '#/infrastructure/database/repositories/user.repository';

@Injectable()
export class UserInformationInterceptor implements NestInterceptor {
	constructor(
		private readonly authService: AuthService,
		private readonly userRepository: UserRepository,
	) {}

	async intercept(context: ExecutionContext, next: CallHandler) {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse<Response>();

		// NOTE : 원활한 개발을 위해 임시로 생성한 Admin 계정에 접근 가능하도록 하는 Key
		const adminUser = await this.authService.checkIsAdminRequest(request);

		if (adminUser) {
			request.user = adminUser;
			return next.handle();
		}

		const { accessToken, refreshToken } = request.cookies ?? {};

		if (!refreshToken) {
			request.user = null;
			return next.handle();
		}

		const userId = await this.authService
			.verifyAuthenticateToken(accessToken)
			.catch(() =>
				this.authService.reIssueAuthenticateToken(
					response,
					refreshToken,
				),
			);

		if (!userId) {
			request.user = null;
			return next.handle();
		}

		const user = await this.userRepository.findById(userId);

		if (!user) {
			request.user = null;
			return next.handle();
		}

		request.user = user;
		return next.handle();
	}
}
