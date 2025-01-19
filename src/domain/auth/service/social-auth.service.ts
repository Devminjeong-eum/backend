import { Injectable } from '@nestjs/common';

import { type CookieOptions, type Response } from 'express';

@Injectable()
export class SocialAuthService {
	private readonly ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
	private readonly REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
	private readonly ACCESS_TOKEN_MAX_AGE = 5 * 60 * 1000;
	private readonly REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
	private AUTH_COOKIE_OPTION: CookieOptions = {
		secure: true,
		sameSite: 'none',
		httpOnly: true,
		path: '/',
		domain: '.dev-malssami.site',
	};

	setAuthenticateCookie({
		response,
		accessToken,
		refreshToken,
	}: {
		response: Response;
		accessToken: string;
		refreshToken: string;
	}) {
		response.cookie(this.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
			...this.AUTH_COOKIE_OPTION,
			maxAge: this.ACCESS_TOKEN_MAX_AGE,
		});
		response.cookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
			...this.AUTH_COOKIE_OPTION,
			maxAge: this.REFRESH_TOKEN_MAX_AGE,
		});
	}

	removeAuthenticateCookie({ response }: { response: Response }) {
		response.cookie('accessToken', '', {
			...this.AUTH_COOKIE_OPTION,
			maxAge: 0,
		});
		response.cookie('refreshToken', '', {
			...this.AUTH_COOKIE_OPTION,
			maxAge: 0,
		});
	}
}
