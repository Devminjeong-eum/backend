import {
	CallHandler,
	ExecutionContext,
	Injectable,
	InternalServerErrorException,
	NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserRepository } from '#databases/repositories/user.repository';

import { AuthService } from '../../auth/auth.service';

@Injectable()
export class UserInformationInterceptor implements NestInterceptor {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
		private readonly userRepository: UserRepository,
	) {}

	async intercept(context: ExecutionContext, next: CallHandler) {
		const request = context.switchToHttp().getRequest();

		// NOTE : 원활한 개발을 위해 임시로 생성한 Admin 계정에 접근 가능하도록 하는 Key
		const { authorization: requestAdminKey } = request.headers;
		const adminKey = this.configService.get<string>('TEST_ADMIN_KEY');

		if (requestAdminKey && adminKey && requestAdminKey === adminKey) {
			const adminUser = await this.userRepository.findById(adminKey);

			if (!adminUser)
				throw new InternalServerErrorException(
					'Admin User 정보가 DB 에 존재하지 않습니다.',
				);

			request.user = adminUser;
			return next.handle();
		}

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
