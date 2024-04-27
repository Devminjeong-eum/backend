import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService) {}

	getAuthenticateToken(userId: string) {
		const payload = { id: userId };
		const accessToken = this.jwtService.sign(payload, { expiresIn: '5m' });
		const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

		return { accessToken, refreshToken };
	}
}
