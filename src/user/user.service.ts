import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';

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
		const userInformation =
			await this.userRepository.findByIdWithLikeCount(userId);

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

	async removeUserInformation(userId: string) {
		const user = await this.userRepository.findByIdWithLikeRelation(userId);

		if (!user) {
			throw new BadRequestException('존재하지 않는 유저입니다');
		}

		const deleteResult = await this.userRepository.deleteOne(user);

		if (!deleteResult) {
			throw new InternalServerErrorException(
				'유저 정보가 정상적으로 삭제되지 않았습니다.',
			);
		}

		return true;
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
