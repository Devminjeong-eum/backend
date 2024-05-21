import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Response } from 'express';

import { UserRepository } from '#databases/repositories/user.repository';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
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

		// NOTE : 원활한 개발을 위해 임시로 생성한 Admin 계정에 접근 가능하도록 하는 Key
		const { admin_key: requestAdminKey } = request.headers;
		const adminKey = this.configService.get<string>('TEST_ADMIN_KEY');

		if (requestAdminKey && adminKey && requestAdminKey === adminKey) {
			const user = await this.userRepository.findById(adminKey);
			request.user = user;
			return true;
		}

		const { accessToken, refreshToken } = request.cookies ?? {};

		if (!accessToken || !refreshToken) {
			throw new UnauthorizedException(
				'요청에 계정 정보가 존재하지 않습니다.',
			);
		}

		let userId: string;

		try {
			userId =
				await this.authService.verifyAuthenticateToken(accessToken);
		} catch (error) {
			userId = await this.authService
				.verifyAuthenticateToken(accessToken)
				.catch(() => {
					this.removeAuthenticateCookie(response);
					throw new UnauthorizedException(
						'토큰이 만료되었습니다. 다시 로그인해주세요.',
					);
				});

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

		const user = await this.userRepository.findById(userId);

		if (!user) {
			this.removeAuthenticateCookie(response);
			throw new UnauthorizedException('유효하지 않은 계정 정보입니다.');
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

	private removeAuthenticateCookie(response: Response) {
		response.cookie('accessToken', '', {
			...this.cookieOption,
			maxAge: 0,
		});
		response.cookie('refreshToken', '', {
			...this.cookieOption,
			maxAge: 0,
		});
	}
}
