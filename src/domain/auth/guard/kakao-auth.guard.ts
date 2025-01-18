import type { CanActivate, ExecutionContext } from '@nestjs/common';
import {
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { checkIsAxiosError, getAsync, postAsync } from '#/shared/apis';

import type {
	KakaoOauthResponse,
	KakaoProfileResponse,
} from '../interface/kakao-auth.interface';

const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
const KAKAO_USER_URL = 'https://kapi.kakao.com/v2/user/me';

@Injectable()
export class KakaoAuthGuard implements CanActivate {
	private readonly KAKAO_REDIRECT_URI: string;
	private readonly KAKAO_CLIENT_ID: string;
	private readonly KAKAO_SECRET_KEY: string;

	constructor(private readonly configService: ConfigService) {
		this.KAKAO_REDIRECT_URI =
			this.configService.getOrThrow<string>('KAKAO_REDIRECT_URI')!;
		this.KAKAO_CLIENT_ID =
			this.configService.getOrThrow<string>('KAKAO_CLIENT_ID')!;
		this.KAKAO_SECRET_KEY =
			this.configService.getOrThrow<string>('KAKAO_SECRET_KEY')!;
	}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();

		const { code } = request.query;

		if (typeof code !== 'string') {
			throw new UnauthorizedException(
				'Kakao 측에서 인계 받은 Code 가 유효하지 않습니다.',
			);
		}

		try {
			const accessToken = await this.getKakaoAccessToken(code);
			request.user = await this.getKakaoUserProfile(accessToken);
			return true;
		} catch (error) {
			if (checkIsAxiosError(error)) {
				throw new InternalServerErrorException({
					error: error.response?.data,
					message:
						'Kakao 서버와 통신하는 과정에서 문제가 발생했습니다.',
				});
			}

			throw error;
		}
	}

	private async getKakaoAccessToken(code: string) {
		const { access_token } = await postAsync<KakaoOauthResponse>(
			KAKAO_TOKEN_URL,
			null,
			{
				params: {
					grant_type: 'authorization_code',
					client_id: this.KAKAO_CLIENT_ID,
					client_secret: this.KAKAO_SECRET_KEY,
					redirect_uri: this.KAKAO_REDIRECT_URI,
					code,
				},
			},
		);

		return access_token;
	}

	private async getKakaoUserProfile(accessToken: string) {
		const {
			id,
			properties: { nickname, profile_image },
		} = await getAsync<KakaoProfileResponse>(KAKAO_USER_URL, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

		return {
			id,
			nickname,
			profileImage: profile_image,
		};
	}
}
