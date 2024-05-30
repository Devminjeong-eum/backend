import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { Response } from 'express';

import { ApiDocs } from '#/common/decorators/swagger.decorator';
import { ResponseUserInformationDto } from '#/user/dto/user-information.dto';
import { UserService } from '#/user/user.service';

import { AuthService } from './auth.service';
import { AuthenticatedUser } from './decorator/auth.decorator';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { KakaoAuthUser } from './interface/kakao-auth.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

	@ApiDocs({
		summary: 'Kakao OAuth2 로그인을 진행합니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseUserInformationDto,
		},
	})
	@Get('kakao')
	@UseGuards(KakaoAuthGuard)
	async kakaoLogin(
		@AuthenticatedUser() authenticatedUser: KakaoAuthUser,
		@Res({ passthrough: true }) response: Response,
	) {
		const { nickname, profileImage, id } = authenticatedUser;
		const user = await this.userService.oAuthLogin({
			name: nickname,
			id: `kakao_${id}`,
			profileImage,
			socialType: 'kakao',
		});

		const { accessToken, refreshToken } =
			this.authService.getAuthenticateToken(user.id);

		this.authService.setAuthenticateCookie(
			response,
			accessToken,
			refreshToken,
		);

		return user;
	}
}
