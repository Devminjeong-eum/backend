import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import dayjs from 'dayjs';

import { UserRole } from '#/infrastructure/drizzle/constant/user-role.constant';

import type { AuthTokenPayload } from '../interface/jwt-auth.interface';

@Injectable()
export class AuthTokenService {
	constructor(private readonly jwtService: JwtService) {}

	generateAuthToken({
		userId,
		name,
		role,
	}: {
		userId: string;
		name: string;
		role: UserRole;
	}) {
		const payload = { id: userId, name, role };
		const accessToken = this.jwtService.sign(payload, { expiresIn: '5m' });
		const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

		return { accessToken, refreshToken };
	}

	reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
		const payload = this.jwtService.verify<AuthTokenPayload>(refreshToken);

		if (!payload) {
			throw new UnauthorizedException('유효하지 않은 계정 정보입니다.');
		}

		if (dayjs().isAfter(payload.exp * 1000)) {
			throw new UnauthorizedException('이미 만료된 리프레시 토큰입니다.');
		}

		return this.jwtService.sign(payload, { expiresIn: '5m' });
	}
}
