import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RequestCreateUserDto } from '#/user/dto/create-user.dto';
import { User } from '#databases/entities/user.entity';

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
		return this.userRepository.findOneBy({ id });
	}

	findByName(name: string) {
		return this.userRepository.findOneBy({ name });
	}

	updateName(id: string, name: string) {
		return this.userRepository.update(id, { name });
	}
}
