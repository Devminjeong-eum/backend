import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { JwtPayload } from './interface/jwt-auth.interface';

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService) {}

	getAuthenticateToken(userId: string) {
		const payload = { id: userId };
		const accessToken = this.jwtService.sign(payload, { expiresIn: '5m' });
		const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

		console.log({ accessToken, refreshToken });

		return { accessToken, refreshToken };
	}

	async verifyAuthenticateToken(token: string) {
		const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
		return payload.id;
	}
}
