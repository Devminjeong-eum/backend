import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from '#/databases/entities/user.entity';
import { RequestOAuthLoginDto } from '#/user/dto/oauth-login.dto';

@Injectable()
export class UserRepository {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async create(userDto: RequestOAuthLoginDto) {
		return this.userRepository.create(userDto);
	}

	findById(id: string) {
		return this.userRepository.findOneBy({ id });
	}

	findByName(name: string) {
		return this.userRepository.findOneBy({ name });
	}

	findByEmail(email: string) {
		return this.userRepository.findOneBy({ email });
	}

	updateName(id: string, name: string) {
		return this.userRepository.update(id, { name });
	}
}
