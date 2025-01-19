import type {
	CallHandler,
	ExecutionContext,
	NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { Request } from 'express';

import type { AuthTokenPayload } from '#/domain/auth/interface/jwt-auth.interface';
import { UserRepository } from '#/infrastructure/drizzle/repository/user.repository';
import type { UserEntity } from '#/infrastructure/drizzle/schema/user.schema';

@Injectable()
export class UserInformationInterceptor implements NestInterceptor {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userRepository: UserRepository,
	) {}

	async intercept(context: ExecutionContext, next: CallHandler) {
		const request: Request & {
			user: UserEntity | null;
		} = context.switchToHttp().getRequest();

		const { accessToken, refreshToken } = request.cookies ?? {};

		if (!refreshToken) {
			request.user = null;
			return next.handle();
		}

		const payload = this.jwtService.verify<AuthTokenPayload>(accessToken);

		if (!payload) {
			request.user = null;
			return next.handle();
		}

		const user = await this.userRepository.findById({ userId: payload.id });

		if (!user) {
			request.user = null;
			return next.handle();
		}

		request.user = user;
		return next.handle();
	}
}
