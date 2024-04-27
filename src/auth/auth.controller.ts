import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import type { Response } from 'express';

import { ResponseUserInformationDto } from '#/user/dto/user-information.dto';
import { UserService } from '#/user/user.service';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from './decorator/auth.decorator';
import { KakaoAuthUser } from './interface/kakao-auth.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

	@ApiOperation({
		summary: 'Kakao OAuth2 로그인을 진행합니다.',
	})
	@ApiResponse({
		status: 200,
		description: '카카오 로그인 성공 시 받는 응답',
		type: ResponseUserInformationDto,
	})
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
