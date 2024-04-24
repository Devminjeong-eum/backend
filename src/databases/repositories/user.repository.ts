import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from '#/databases/entities/user.entity';

@Injectable()
export class UserRepository {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async create(userDto: User) {
		const user = this.userRepository.create(userDto);
		await this.userRepository.save(user);
		return user;
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
