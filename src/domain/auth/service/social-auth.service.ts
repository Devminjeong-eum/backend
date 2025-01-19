import { Injectable, InternalServerErrorException } from '@nestjs/common';

import type { RequestCreateUserDto } from '#/domain/auth/dto/create-user.dto';
import { UserRepository } from '#/infrastructure/database/repositories/user.repository';

@Injectable()
export class SocialAuthService {
	constructor(private readonly userRepository: UserRepository) {}

	async oAuthLogin({
		socialPlatformId,
		profileImage,
		name,
		socialType,
	}: RequestCreateUserDto) {
		const alreadyJoinedUser =
			await this.userRepository.findBySocialPlatformId({
				socialPlatformId,
				socialType,
			});

		if (alreadyJoinedUser) return alreadyJoinedUser;

		const registeredUser = await this.userRepository.create({
			socialPlatformId,
			profileImage,
			name,
			socialType,
		});

		if (!registeredUser) {
			throw new InternalServerErrorException(
				'유저 정보가 정상적으로 생성되지 않았습니다.',
			);
		}

		return registeredUser;
	}
}
