import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { generateNanoId } from '#/common/utils/nanoid';
import { User } from '#/databases/entities/user.entity';
import { RequestCreateUserDto } from '#/user/dto/create-user.dto';

@Injectable()
export class UserRepository {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	private USER_ID_LENGTH = 8;

	private async generatedUserId() {
		let id: string;
		let isAlreadyUsed: boolean;

		do {
			const nanoId = generateNanoId({
				allowedOption: ['UPPERCASE', 'NUMBER'],
				length: this.USER_ID_LENGTH,
			});
			id = `user_${nanoId}`;
			isAlreadyUsed = await this.userRepository.exists({
				where: { id },
			});
		} while (isAlreadyUsed);

		return id;
	}

	async create(user: RequestCreateUserDto) {
		const userId = await this.generatedUserId();
		const registeredUser = this.userRepository.create({
			...user,
			id: userId,
		});
		return await this.userRepository.save(registeredUser);
	}

	checkIsExistsById(userId: string) {
		return this.userRepository
			.createQueryBuilder('user')
			.where('user.id = :userId', { userId })
			.getExists();
	}

	deleteOne(user: User) {
		return this.userRepository.softRemove(user);
	}

	findById(userId: string) {
		return this.userRepository.findOne({
			where: { id: userId },
		});
	}

	findBySocialPlatformId({
		socialPlatformId,
		socialType,
	}: {
		socialPlatformId: string;
		socialType: string;
	}) {
		return this.userRepository
			.createQueryBuilder('user')
			.where('user.socialPlatformId = :socialPlatformId', {
				socialPlatformId,
			})
			.andWhere('user.socialType = :socialType', { socialType })
			.getOne();
	}

	findByIdWithLikeRelation(userId: string) {
		return this.userRepository.findOne({
			where: { id: userId },
			relations: ['likes'],
		});
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
