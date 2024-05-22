import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from '#/databases/entities/user.entity';
import { RequestCreateUserDto } from '#/user/dto/create-user.dto';

@Injectable()
export class UserRepository {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async create(user: RequestCreateUserDto) {
		const registeredUser = this.userRepository.create(user);
		return await this.userRepository.save(registeredUser);
	}

	findById(id: string) {
		return this.userRepository.findOne({
			where: {
				id,
			},
			select: {
				id: true,
				profileImage: true,
				name: true,
				socialType: true,
			},
		});
	}

	findByName(name: string) {
		return this.userRepository.findOne({
			where: {
				name,
			},
			select: {
				id: true,
				profileImage: true,
				name: true,
				socialType: true,
			},
		});
	}

	updateName(id: string, name: string) {
		return this.userRepository.update(id, { name });
	}
}
