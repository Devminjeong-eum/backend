import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import type { Response } from 'express';

import { UserService } from '#/user/user.service';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from './decorator/auth.decorator';
import { KakaoAuthUser } from './interface/kakao-auth.interface';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

	@Get('kakao')
	@UseGuards(AuthGuard('kakao'))
	async kakaoLogin(
		@AuthenticatedUser() authenticatedUser: KakaoAuthUser,
		@Res({ passthrough: true }) response: Response,
	) {
		const { nickname, profileImage, id } = authenticatedUser;
		const user = await this.userService.registerUser({
			name: nickname,
			id: `kakao_${id}`,
			profileImage,
			socialType: 'kakao',
		});

		const { accessToken, refreshToken } =
			this.authService.getAuthenticateToken(user.id);

		const cookieOption = {
			secure: true,
			sameSite: 'none',
			path: '/',
		} as const;

		response.cookie('accessToken', accessToken, {
			...cookieOption,
			maxAge: 5 * 60 * 1000,
		});
		response.cookie('refreshToken', refreshToken, {
			...cookieOption,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return user;
	}
}
