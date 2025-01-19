import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '#/infrastructure/drizzle/repository/user.repository';

import type { AuthTokenPayload } from '../interface/jwt-auth.interface';

@Injectable()
export class AuthenticationGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userRepository: UserRepository,
	) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();

		const { accessToken, refreshToken } = request.cookies ?? {};

		if (!refreshToken) {
			throw new UnauthorizedException(
				'요청에 계정 정보가 존재하지 않습니다. 로그인을 진행해주세요.',
			);
		}

		const payload = this.jwtService.verify<AuthTokenPayload>(accessToken);

		if (!payload) {
			throw new UnauthorizedException('엑세스 토큰이 유효하지 않습니다.');
		}

		const user = await this.userRepository.findById({ userId: payload.id });
		if (!user) return false;

		request.user = user;
		return true;
	}
}
