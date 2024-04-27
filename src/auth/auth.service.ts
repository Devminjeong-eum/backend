import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '../databases/repositories/user.repository';

import { RequestLoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interface/jwt-auth.interface';

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly jwtService: JwtService,
	) {}

	getAuthenticateToken(userId: string) {
		const payload = { id: userId };
		const accessToken = this.jwtService.sign(payload, { expiresIn: '5m' });
		const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

		return { accessToken, refreshToken };
	}

	async kakaoLogin(loginUserDto: RequestLoginUserDto) {
		const { email } = loginUserDto;
		let user = await this.userRepository.findByEmail(email);

		if (!user) {
			user = await this.userRepository.create(loginUserDto);
		}

		return this.getAuthenticateToken(user.id);
	}

	async validateAuthenticateToken(payload: JwtPayload) {
        const user = await this.userRepository.findById(payload.id);

        if (!user) {
            throw new UnauthorizedException('유효하지 않은 계정 정보입니다.');
        }
    }
}
