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

	checkIsExistsById(userId: string) {
		return this.userRepository
			.createQueryBuilder('user')
			.where('user.id = :userId', { userId })
			.getExists();
	}

	deleteById(user: User) {
		return this.userRepository.softRemove(user);
	}

	findById(userId: string) {
		return this.userRepository.findOne({ where: { id: userId } });
	}

	findByIdWithLikeCount(userId: string) {
		return this.userRepository
			.createQueryBuilder('user')
			.leftJoin('user.likes', 'like')
			.where('user.id = :userId', { userId })
			.select([
				'user.id',
				'user.profileImage',
				'user.name',
				'COUNT(like.id) as likeCount',
			])
			.groupBy('user.id')
			.getRawOne();
	}

	findByName(name: string) {
		return this.userRepository
			.createQueryBuilder('user')
			.leftJoin('user.likes', 'like')
			.where('user.name = :name', { name })
			.select([
				'user.id',
				'user.profileImage',
				'user.name',
				'COUNT(like.id) as likeCount',
			])
			.groupBy('user.id')
			.getRawOne();
	}

	updateName(id: string, name: string) {
		return this.userRepository.update(id, { name });
	}
}
