import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
	InternalServerErrorException,
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
		const { authorization: requestAdminKey } = request.headers;
		const adminKey = this.configService.get<string>('TEST_ADMIN_KEY');

		if (requestAdminKey && adminKey && requestAdminKey === adminKey) {
			const adminUser = await this.userRepository.findById(adminKey);

			if (!adminUser)
				throw new InternalServerErrorException(
					'Admin User 정보가 DB 에 존재하지 않습니다. 관리자에게 문의하세요.',
				);

			request.user = adminUser;
			return true;
		}

		const { accessToken, refreshToken } = request.cookies ?? {};

		if (!refreshToken) {
			throw new UnauthorizedException(
				'요청에 계정 정보가 존재하지 않습니다. 로그인을 진행해주세요.',
			);
		}

		const userId = await this.authService
			.verifyAuthenticateToken(accessToken)
			.catch(() => this.checkRefreshToken(response, refreshToken));

		const user = await this.userRepository.findById(userId);

		if (!user) {
			this.removeAuthenticateCookie(response);
			throw new BadRequestException('유효하지 않은 계정 정보입니다.');
		}

		request.user = user;
		return true;
	}

	private async checkRefreshToken(response: Response, refreshToken: string) {
		try {
			const userId =
				await this.authService.verifyAuthenticateToken(refreshToken);
			const {
				accessToken: reIssueAccessToken,
				refreshToken: reIssueRefreshToken,
			} = this.authService.getAuthenticateToken(userId);

			this.setAuthenticateCookie(
				response,
				reIssueAccessToken,
				reIssueRefreshToken,
			);
			return userId;
		} catch (error) {
			this.removeAuthenticateCookie(response);
			throw new UnauthorizedException(
				'토큰이 만료되었습니다. 다시 로그인해주세요.',
			);
		}
	}

	private setAuthenticateCookie(
		response: Response,
		accessToken: string,
		refreshToken: string,
	) {
		response.cookie('accessToken', accessToken, {
			...this.cookieOption,
			maxAge: 5 * 60 * 1000, // NOTE : 5H
		});
		response.cookie('refreshToken', refreshToken, {
			...this.cookieOption,
			maxAge: 7 * 24 * 60 * 60 * 1000, // NOTE : 7D
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
