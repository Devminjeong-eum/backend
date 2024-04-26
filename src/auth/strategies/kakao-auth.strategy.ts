import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Profile, Strategy } from 'passport-kakao';

import { KakaoAuthUser } from '#/auth/decorators/kakao-auth.decorator';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
	constructor(
		private readonly configService: ConfigService,
	) {
		super({
			clientID: configService.get<string>('KAKAO_CLIENT_ID'),
			clientSecret: configService.get<string>('KAKAO_SECRET_KEY'),
			scope: ['profile_nickname', 'profile_image'],
			callbackURL: '/auth/kakao/callback',
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: (error: null | Error, user?: KakaoAuthUser) => void,
	) {
		const { email, profile_nickname, profile_image } =
			profile._json.kakao_account;

		done(null, {
			email,
			nickname: profile_nickname,
			profileImage: profile_image,
		});
	}
}
