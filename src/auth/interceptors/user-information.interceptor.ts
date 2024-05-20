import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '#databases/repositories/user.repository';

import type { JwtPayload } from '../interface/jwt-auth.interface';

@Injectable()
export class UserInformationInterceptor implements NestInterceptor {
	constructor(
		private readonly jwtService: JwtService,
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
			userId = await this.jwtService
				.verifyAsync<JwtPayload>(accessToken)
				.then((payload) => payload.id);
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
