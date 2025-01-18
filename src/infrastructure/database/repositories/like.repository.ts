import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Like } from '#/infrastructure/database/entities/like.entity';
import type { User } from '#/infrastructure/database/entities/user.entity';
import type { Word } from '#/infrastructure/database/entities/word.entity';

@Injectable()
export class LikeRepository {
	constructor(
		@InjectRepository(Like)
		private likeRepository: Repository<Like>,
	) {}

	async create(word: Word, user: User) {
		const createdLikeEntity = this.likeRepository.create({
			word,
			user,
		});
		return await this.likeRepository.save(createdLikeEntity);
	}

	async findByUserAndWord(word: Word, user: User) {
		return await this.likeRepository.findOne({
			where: {
				word: { id: word.id },
				user: { id: user.id },
			},
			relations: ['word', 'user'],
		});
	}

	async restore(word: Word, user: User) {
		return await this.likeRepository
			.createQueryBuilder('like')
			.update()
			.restore()
			.where('wordId = :wordId', { wordId: word.id })
			.andWhere('userId = :userId', { userId: user.id })
			.execute();
	}

	async softDelete(word: Word, user: User) {
		return await this.likeRepository
			.createQueryBuilder('like')
			.update()
			.softDelete()
			.where('wordId = :wordId', { wordId: word.id })
			.andWhere('userId = :userId', { userId: user.id })
			.execute();
	}
}
