import {
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserRepository } from '#/infrastructure/drizzle/repository/user.repository';
import { checkIsAxiosError, getAsync, postAsync } from '#/shared/apis';

import type {
	KakaoOauthResponse,
	KakaoProfileResponse,
} from '../interface/kakao-auth.interface';

const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
const KAKAO_USER_URL = 'https://kapi.kakao.com/v2/user/me';

@Injectable()
export class KakaoAuthService {
	private readonly KAKAO_REDIRECT_URI: string;
	private readonly KAKAO_CLIENT_ID: string;
	private readonly KAKAO_SECRET_KEY: string;
	private readonly SOCIAL_PLARFORM = 'kakao';

	constructor(
		private readonly userRepository: UserRepository,
		private readonly configService: ConfigService,
	) {
		this.KAKAO_REDIRECT_URI =
			this.configService.getOrThrow<string>('KAKAO_REDIRECT_URI');
		this.KAKAO_CLIENT_ID =
			this.configService.getOrThrow<string>('KAKAO_CLIENT_ID');
		this.KAKAO_SECRET_KEY =
			this.configService.getOrThrow<string>('KAKAO_SECRET_KEY');
	}

	async login(code: string) {
		const accessToken = await this.getKakaoAccessToken(code);
		const {
			id: socialPlatformId,
			nickname,
			profileImage,
		} = await this.getKakaoUserProfile(accessToken);

		const alreadyJoinedUser =
			await this.userRepository.findBySocialPlatformId({
				socialPlatformId,
				socialType: this.SOCIAL_PLARFORM,
			});

		if (alreadyJoinedUser) return alreadyJoinedUser;

		const registeredUser = await this.userRepository.create({
			socialPlatformId,
			profileImage,
			name: nickname,
			socialType: this.SOCIAL_PLARFORM,
		});

		if (!registeredUser) {
			throw new InternalServerErrorException(
				'유저 정보가 정상적으로 생성되지 않았습니다.',
			);
		}

		return registeredUser;
	}

	private async getKakaoAccessToken(code: string) {
		try {
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
		} catch (error) {
			if (checkIsAxiosError(error)) {
				const errorStatus =
					error.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
				const errorMessage =
					error.response?.data ??
					'Kakao 서버와 통신하는 과정에서 문제가 발생했습니다.';
				throw new HttpException(errorMessage, errorStatus);
			}
			throw new InternalServerErrorException(
				'Kakao 서버와 통신하는 과정에서 문제가 발생했습니다.',
			);
		}
	}

	private async getKakaoUserProfile(accessToken: string) {
		try {
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
		} catch (error) {
			if (checkIsAxiosError(error)) {
				const errorStatus =
					error.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
				const errorMessage =
					error.response?.data ??
					'Kakao 서버와 통신하는 과정에서 문제가 발생했습니다.';
				throw new HttpException(errorMessage, errorStatus);
			}
			throw new InternalServerErrorException(
				'Kakao 서버와 통신하는 과정에서 문제가 발생했습니다.',
			);
		}
	}
}
