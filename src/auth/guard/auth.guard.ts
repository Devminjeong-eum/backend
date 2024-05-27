import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';

import type { Response } from 'express';

import { AuthService } from '#/auth/auth.service';
import { UserRepository } from '#databases/repositories/user.repository';

@Injectable()
export class AuthenticationGuard implements CanActivate {
	constructor(
		private readonly authService: AuthService,
		private readonly userRepository: UserRepository,
	) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse<Response>();

		// NOTE : 원활한 개발을 위해 임시로 생성한 Admin 계정에 접근 가능하도록 하는 Key
		const adminUser = await this.authService.checkIsAdminRequest(request);

		if (adminUser) {
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
			.catch(() =>
				this.authService.reIssueAuthenticateToken(
					response,
					refreshToken,
				),
			);

		if (!userId) {
			throw new UnauthorizedException('유저 정보가 만료되었습니다. 로그인을 진행해주세요.')
		}

		const user = await this.userRepository.findById(userId);

		if (!user) {
			this.authService.removeAuthenticateCookie(response);
			throw new BadRequestException('유효하지 않은 계정 정보입니다.');
		}

		request.user = user;
		return true;
	}
}
