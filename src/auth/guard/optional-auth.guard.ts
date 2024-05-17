import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { Response } from 'express';

import { UserRepository } from '#databases/repositories/user.repository';

import { AuthService } from '../auth.service';
import { JwtPayload } from '../interface/jwt-auth.interface';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly authService: AuthService,
		private readonly userRepository: UserRepository,
	) {}

	private cookieOption = {
		secure: true,
		sameSite: 'none',
		path: '/',
	} as const;

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse<Response>();

		const { accessToken, refreshToken } = request.cookies ?? {};

		if (!accessToken || !refreshToken) {
			request.user = null;
			return true;
		}

		let userId: string | null;

		try {
			const payload =
				await this.jwtService.verifyAsync<JwtPayload>(accessToken);
			userId = payload.id;
		} catch (error) {
			userId = await this.jwtService
				.verifyAsync<JwtPayload>(refreshToken)
				.then((payload) => payload.id)
				.catch(() => null);

			if (userId) {
				const {
					accessToken: reIssueAccessToken,
					refreshToken: reIssueRefreshToken,
				} = this.authService.getAuthenticateToken(userId);

				this.setAuthenticateCookie(
					response,
					reIssueAccessToken,
					reIssueRefreshToken,
				);
			}
		}

		if (!userId) {
			request.user = null;
			return true;
		}

		const user = await this.userRepository.findById(userId);

		if (!user) {
			request.user = null;
			return true;
		}

		request.user = user;
		return true;
	}

	private setAuthenticateCookie(
		response: Response,
		accessToken: string,
		refreshToken: string,
	) {
		response.cookie('accessToken', accessToken, {
			...this.cookieOption,
			maxAge: 5 * 60 * 1000,
		});
		response.cookie('refreshToken', refreshToken, {
			...this.cookieOption,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
	}
}
