import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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
		path: '/',
	} as const;

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
			this.removeAuthenticateCookie(response);
		}
	}

	setAuthenticateCookie(
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
