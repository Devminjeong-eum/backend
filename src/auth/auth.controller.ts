import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import type { Response } from 'express';

import { AuthService } from './auth.service';
import { AuthenticatedUser } from './decorator/auth.decorator';
import { KakaoAuthUser } from './interface/kakao-auth.interface';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get('kakao')
	@UseGuards(AuthGuard('kakao'))
	async kakaoLogin(
		@AuthenticatedUser() authenticatedUser: KakaoAuthUser,
		@Res({ passthrough: true }) response: Response,
	) {
		const { accessToken, refreshToken } =
			await this.authService.kakaoLogin(authenticatedUser);

		response.cookie('accessToken', accessToken, {
			secure: true,
			maxAge: 5 * 60 * 1000,
			sameSite: 'none',
			path: '/',
		});
		response.cookie('refreshToken', refreshToken, {
			secure: true,
			maxAge: 7 * 24 * 60 * 60 * 1000,
			sameSite: 'none',
			path: '/',
		});

		response.redirect('/');
	}
}
