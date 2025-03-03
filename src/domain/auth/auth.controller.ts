import {
	Controller,
	Delete,
	Get,
	HttpStatus,
	Patch,
	Query,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { type CookieOptions, type Request, type Response } from 'express';

import { ResponseUserInformationDto } from '#/domain/user/dto';
import { ApiDocs } from '#/shared/decorators/swagger.decorator';

import { AuthenticationGuard } from './guard/auth.guard';
import { AuthTokenService } from './service/auth-token.service';
import { KakaoAuthService } from './service/kakao-auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authTokenService: AuthTokenService,
		private readonly kakaoAuthService: KakaoAuthService,
	) {}

	private readonly ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
	private readonly REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
	private readonly ACCESS_TOKEN_MAX_AGE = 20 * 60 * 1000;
	private readonly REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
	private AUTH_COOKIE_OPTION: CookieOptions = {
		secure: true,
		sameSite: 'none',
		httpOnly: true,
		path: '/',
		domain: '.dev-malssami.site',
	};

	@ApiDocs({
		summary: 'Kakao OAuth2 로그인을 진행합니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseUserInformationDto,
		},
	})
	@Get('kakao')
	async kakaoLogin(
		@Query('code') code: string,
		@Res({ passthrough: true }) response: Response,
	) {
		const user = await this.kakaoAuthService.login(code);
		const { accessToken, refreshToken } =
			this.authTokenService.generateAuthToken({ userId: user.id, name: user.name, role: user.role });

		response.cookie(this.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
			...this.AUTH_COOKIE_OPTION,
			maxAge: this.ACCESS_TOKEN_MAX_AGE,
		});
		response.cookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
			...this.AUTH_COOKIE_OPTION,
			maxAge: this.REFRESH_TOKEN_MAX_AGE,
		});

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
		response.cookie(this.ACCESS_TOKEN_COOKIE_NAME, '', {
			...this.AUTH_COOKIE_OPTION,
			maxAge: 0,
		});
		response.cookie(this.REFRESH_TOKEN_COOKIE_NAME, '', {
			...this.AUTH_COOKIE_OPTION,
			maxAge: 0,
		});
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
		const reIssueAccessToken = this.authTokenService.reIssueAccessToken({
			refreshToken: request.cookies?.refreshToken,
		});

		response.cookie(this.REFRESH_TOKEN_COOKIE_NAME, reIssueAccessToken, {
			...this.AUTH_COOKIE_OPTION,
			maxAge: 0,
		});
	}
}
