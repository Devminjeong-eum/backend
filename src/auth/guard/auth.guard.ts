import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { Request, Response } from 'express';

import { AuthService } from '../auth.service';
import { JwtPayload } from '../interface/jwt-auth.interface';

import { UserRepository } from '#/databases/repositories/user.repository';

@Injectable()
export class AuthenticationGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly authService: AuthService,
		private readonly userRepository: UserRepository,
	) {}

	private cookieOption = {
		secure: true,
		sameSite: 'none',
		path: '/',
	} as const;

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest<Request>();
		const response = context.switchToHttp().getResponse<Response>();

		const { accessToken, refreshToken } = request.cookies ?? {};

		// if (!accessToken || !refreshToken) {
		// 	throw new UnauthorizedException(
		// 		'요청에 계정 정보가 존재하지 않습니다.',
		// 	);
		// }

		let userId: string;

		console.log(this.jwtService);

		try {
			userId = await this.jwtService
				.verifyAsync<JwtPayload>(accessToken)
				.then((payload) => payload.id);
		} catch (error) {
			userId = await this.jwtService
				.verifyAsync<JwtPayload>(refreshToken)
				.then((payload) => payload.id)
				.catch((error) => {
					console.log(error);
					this.removeAuthenticateCookie(response);
					throw new UnauthorizedException(
						'토큰이 만료되었습니다. 다시 로그인해주세요.',
					);
				});

			const {
				accessToken: reIssueAccessToken,
				refreshToken: reIssueRefreshToken,
			} = this.authService.getAuthenticateToken(userId);

			this.setAuthenticateCookie(
				response,
				reIssueAccessToken,
				reIssueRefreshToken,
			);
		}

		const user = await this.userRepository.findById(userId);

		if (!user) {
			this.removeAuthenticateCookie(response);
			throw new UnauthorizedException('유효하지 않은 계정 정보입니다.');
		}

		request.user = user;
		return true;
	}

	private setAuthenticateCookie(
		response: Response,
		accessToken: string,
		refreshToken: string,
	) {
		response.cookie('accessToken', accessToken, {
			...this.cookieOption,
			maxAge: 5 * 60 * 1000,
		});
		response.cookie('refreshToken', refreshToken, {
			...this.cookieOption,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
	}

	private removeAuthenticateCookie(response: Response) {
		response.cookie('accessToken', '', {
			...this.cookieOption,
			maxAge: 0,
		});
		response.cookie('refreshToken', '', {
			...this.cookieOption,
			maxAge: 0,
		});
	}
}
