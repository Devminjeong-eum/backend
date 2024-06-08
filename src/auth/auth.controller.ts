import {
	Controller,
	Delete,
	Get,
	HttpStatus,
	Patch,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { Request, Response } from 'express';

import { ApiDocs } from '#/common/decorators/swagger.decorator';
import { ResponseUserInformationDto } from '#/user/dto/user-information.dto';
import { UserService } from '#/user/user.service';

import { AuthService } from './auth.service';
import { AuthenticatedUser } from './decorator/auth.decorator';
import { AuthenticationGuard } from './guard/auth.guard';
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

	@ApiDocs({
		summary: '유저의 로그아웃을 진행합니다.',
		headers: {
			name: 'Cookie',
			description:
				'서버로부터 발급 받은 AccessToken 과 RefreshToken 이 필요합니다.',
			required: true,
		},
	})
	@UseGuards(AuthenticationGuard)
	@Delete('logout')
	async logout(@Res({ passthrough: true }) response: Response) {
		this.authService.removeAuthenticateCookie(response);
		return true;
	}

	@ApiDocs({
		summary: 'Refresh Token 을 기반으로 Access Token 을 재발급 합니다.',
		headers: {
			name: 'Cookie',
			description:
				'Refresh Token 이 담긴 Cookie 입니다. 형식은 refreshToken=[유저가 발급받은 Refresh Token] 입니다.',
			required: true,
		},
	})
	@Patch('reissue')
	async reIssueAccessToken(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		const { refreshToken } = request.cookies ?? {};

		return this.authService.reIssueAccessToken(response, refreshToken);
	}
}
