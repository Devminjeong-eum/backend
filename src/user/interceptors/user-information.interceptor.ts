import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';

import { UserRepository } from '#databases/repositories/user.repository';

import { AuthService } from '../../auth/auth.service';

@Injectable()
export class UserInformationInterceptor implements NestInterceptor {
	constructor(
		private readonly authService: AuthService,
		private readonly userRepository: UserRepository,
	) {}

	async intercept(context: ExecutionContext, next: CallHandler) {
		const request = context.switchToHttp().getRequest();

		const { accessToken, refreshToken } = request.cookies ?? {};

		if (!accessToken || !refreshToken) {
			request.user = null;
			return next.handle();
		}

		let userId: string | null;

		try {
			userId =
				await this.authService.verifyAuthenticateToken(accessToken);
		} catch (error) {
			request.user = null;
			return next.handle();
		}

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
