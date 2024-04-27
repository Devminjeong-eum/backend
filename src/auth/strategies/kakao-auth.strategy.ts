import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Profile, Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
	constructor(private readonly configService: ConfigService) {
		super({
			clientID: configService.get<string>('KAKAO_CLIENT_ID'),
			clientSecret: configService.get<string>('KAKAO_SECRET_KEY'),
			callbackURL: '/auth/kakao/callback',
			scope: ['profile_nickname', 'profile_image'],
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
	) {
		const { email, profile_nickname, profile_image } =
			profile._json.kakao_account;

		return {
			email,
			nickname: profile_nickname,
			profileImage: profile_image,
		};
	}
}
