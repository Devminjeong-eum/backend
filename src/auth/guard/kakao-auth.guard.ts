import {
	CanActivate,
	ExecutionContext,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getAsync, postAsync } from '#/common/apis';

import {
	KakaoOauthResponse,
	KakaoProfileResponse,
} from '../interface/kakao-auth.interface';

const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
const KAKAO_USER_URL = 'https://kapi.kakao.com/v2/user/me';

@Injectable()
export class KakaoAuthGuard implements CanActivate {
	constructor(private readonly configService: ConfigService) {}

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
			throw new InternalServerErrorException(
				'Kakao 서버와 통신하는 과정에서 문제가 발생했습니다.',
			);
		}
	}

	private async getKakaoAccessToken(code: string) {
		const redirectUri =
			this.configService.get<string>('KAKAO_REDIRECT_URI');

		if (!redirectUri) {
			throw new InternalServerErrorException(
				'서버에서 세팅된 redirect_uri 정보가 없습니다.',
			);
		}

		const { access_token } = await postAsync<KakaoOauthResponse>(
			KAKAO_TOKEN_URL,
			null,
			{
				params: {
					grant_type: 'authorization_code',
					client_id:
						this.configService.get<string>('KAKAO_CLIENT_ID')!,
					client_secret:
						this.configService.get<string>('KAKAO_SECRET_KEY')!,
					redirect_uri: redirectUri,
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
