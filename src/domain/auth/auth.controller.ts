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

import { type CookieOptions, type Request, type Response } from 'express';

import { ResponseUserInformationDto } from '#/domain/user/dto/user-information.dto';
import { UserService } from '#/domain/user/service/user.service';
import { ApiDocs } from '#/shared/decorators/swagger.decorator';

import { AuthenticatedUser } from './decorator/auth.decorator';
import { AuthenticationGuard } from './guard/auth.guard';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { KakaoAuthUser } from './interface/kakao-auth.interface';
import { AuthTokenService } from './service/auth-token.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authTokenService: AuthTokenService,
		private readonly userService: UserService,
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
	@UseGuards(KakaoAuthGuard)
	async kakaoLogin(
		@AuthenticatedUser() authenticatedUser: KakaoAuthUser,
		@Res({ passthrough: true }) response: Response,
	) {
		const { nickname, profileImage, id } = authenticatedUser;
		const user = await this.userService.oAuthLogin({
			name: nickname,
			profileImage,
			socialPlatformId: id,
			socialType: 'kakao',
		});

		const { accessToken, refreshToken } =
			this.authTokenService.getAuthenticateToken({ userId: id });

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
		const { refreshToken } = request.cookies ?? {};
		const reIssueAccessToken = this.authTokenService.reIssueAccessToken({
			refreshToken,
		});
		response.cookie(this.REFRESH_TOKEN_COOKIE_NAME, reIssueAccessToken, {
			...this.AUTH_COOKIE_OPTION,
			maxAge: 0,
		});
	}
}
