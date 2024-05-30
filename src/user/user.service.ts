import { BadRequestException, Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { UserRepository } from '#databases/repositories/user.repository';

import { RequestChangeNicknameDto } from './dto/change-nickname.dto';
import { RequestCreateUserDto } from './dto/create-user.dto';
import { ResponseUserInformationDto } from './dto/user-information.dto';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async oAuthLogin(createUserDto: RequestCreateUserDto) {
		let user = await this.userRepository.findById(createUserDto.id);

		if (!user) {
			user = await this.userRepository.create(createUserDto);
		}

		return user;
	}

	async getUserInformation(userId: string) {
		const userInformation = await this.userRepository.findById(userId);

		if (!userInformation) {
			throw new BadRequestException('존재하지 않는 유저입니다');
		}

		const responseUserInformationDto = plainToInstance(
			ResponseUserInformationDto,
			userInformation,
			{ excludeExtraneousValues: true },
		);

		return responseUserInformationDto;
	}

	async changeUserNickname(changeNickNameDto: RequestChangeNicknameDto) {
		const { userId, nickname } = changeNickNameDto;
		const isExists = await this.userRepository.checkIsExistsById(userId);

		if (!isExists) {
			throw new BadRequestException('존재하지 않는 유저입니다');
		}

		await this.userRepository.updateName(userId, nickname);
	}
}
