import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

import type { Request, Response } from 'express';

import { UserRepository } from '#databases/repositories/user.repository';

import type { JwtPayload } from './interface/jwt-auth.interface';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly userRepository: UserRepository,
	) {}

	private cookieOption = {
		secure: true,
		sameSite: 'none',
		httpOnly: true,
		path: '/',
		domain: '.dev-malssami.site',
	} as const;

	private readonly ACCESS_TOKEN_MAX_AGE = 5 * 60 * 1000;
	private readonly REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

	async checkIsAdminRequest(request: Request) {
		const { authorization: requestAdminKey } = request.headers;
		const adminKey = this.configService.get<string>('TEST_ADMIN_KEY');

		const isAdminRequest =
			requestAdminKey && adminKey && requestAdminKey === adminKey;

		if (!isAdminRequest) return undefined;

		const adminUser = await this.userRepository.findById(adminKey);

		if (!adminUser)
			throw new InternalServerErrorException(
				'Admin User 정보가 DB 에 존재하지 않습니다. 관리자에게 문의하세요.',
			);

		return adminUser;
	}

	getAuthenticateToken(userId: string) {
		const payload = { id: userId };
		const accessToken = this.jwtService.sign(payload, { expiresIn: '5m' });
		const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

		return { accessToken, refreshToken };
	}

	async verifyAuthenticateToken(token: string) {
		const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
		return payload.id;
	}

	async reIssueAuthenticateToken(response: Response, refreshToken: string) {
		try {
			const userId = await this.verifyAuthenticateToken(refreshToken);
			const {
				accessToken: reIssueAccessToken,
				refreshToken: reIssueRefreshToken,
			} = this.getAuthenticateToken(userId);

			this.setAuthenticateCookie(
				response,
				reIssueAccessToken,
				reIssueRefreshToken,
			);

			return userId;
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				this.removeAuthenticateCookie(response);
				throw new UnauthorizedException(
					'유저 정보가 만료되었습니다. 로그인을 진행해주세요.',
				);
			}
			throw new InternalServerErrorException({
				error,
				message: '인증 토큰을 파싱하는 과정에서 에러가 발생했습니다.',
			});
		}
	}

	async reIssueAccessToken(response: Response, refreshToken?: string) {
		if (!refreshToken) {
			throw new UnauthorizedException(
				'요청에 계정 정보가 존재하지 않습니다. 로그인을 진행해주세요.',
			);
		}

		try {
			const userId = await this.verifyAuthenticateToken(refreshToken);
			const { accessToken: reIssueAccessToken } =
				this.getAuthenticateToken(userId);

			const user = await this.userRepository.findById(userId);

			if (!user) {
				this.removeAuthenticateCookie(response);
				throw new BadRequestException('유효하지 않은 계정 정보입니다.');
			}

			this.setAccessTokenInCookie(response, reIssueAccessToken);
			return true;
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				this.removeAuthenticateCookie(response);
				throw new UnauthorizedException(
					'유저 정보가 만료되었습니다. 로그인을 진행해주세요.',
				);
			}
			throw new InternalServerErrorException({
				error,
				message: '인증 토큰을  파싱하는 과정에서 에러가 발생했습니다.',
			});
		}
	}

	setAuthenticateCookie(
		response: Response,
		accessToken: string,
		refreshToken: string,
	) {
		this.setAccessTokenInCookie(response, accessToken);
		this.setRefreshInCookie(response, refreshToken);
	}

	private setAccessTokenInCookie(response: Response, accessToken: string) {
		response.cookie('accessToken', accessToken, {
			...this.cookieOption,
			maxAge: this.ACCESS_TOKEN_MAX_AGE,
		});
	}

	private setRefreshInCookie(response: Response, refreshToken: string) {
		response.cookie('refreshToken', refreshToken, {
			...this.cookieOption,
			maxAge: this.REFRESH_TOKEN_MAX_AGE,
		});
	}

	removeAuthenticateCookie(response: Response) {
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
