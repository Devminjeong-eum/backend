import { BadRequestException, Injectable } from '@nestjs/common';

import { UserRepository } from '#/databases/repositories/user.repository';
import { RequestChangeNicknameDto } from './dto/change-nickname.dto';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async getUserInformation(userId: string) {
		const userInformation = await this.userRepository.findById(userId);

		if (!userInformation) {
			throw new BadRequestException('존재하지 않는 유저입니다');
		}
		return userInformation;
	}

	async changeUserNickname(changeNickNameDto: RequestChangeNicknameDto) {
		const { userId, nickname } = changeNickNameDto;
		const userInformation = await this.userRepository.findById(userId);

		if (!userInformation) {
			throw new BadRequestException('존재하지 않는 유저입니다');
		}
    
		await this.userRepository.updateName(userId, nickname);
	}
}
