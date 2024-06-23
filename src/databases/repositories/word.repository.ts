import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RequestCreateWordDto } from '#/word/dto/create-word.dto';
import { RequestUpdateWordDto } from '#/word/dto/update-word.dto';
import { RequestWordListDto } from '#/word/dto/word-list.dto';
import { RequestWordUserLikeDto } from '#/word/dto/word-user-like.dto';
import { WORD_SORTING_TYPE } from '#/word/interface/word-list-sorting.interface';
import { Word } from '#databases/entities/word.entity';

@Injectable()
export class WordRepository {
	constructor(
		@InjectRepository(Word)
		private readonly wordRepository: Repository<Word>,
	) {}

	async create(createWordDto: RequestCreateWordDto) {
		const registeredUser = this.wordRepository.create(createWordDto);
		return await this.wordRepository.save(registeredUser);
	}

	async update(
		id: string,
		updateFieldDto: RequestUpdateWordDto,
	): Promise<Word> {
		const result = await this.wordRepository.update({ id }, updateFieldDto);
		return result.raw;
	}

	findByName(name: string) {
		return this.wordRepository.findOneBy({ name });
	}

	findById(wordId: string) {
		return this.wordRepository.findOneBy({ id: wordId });
	}

	async checkIsExistsByIdList(wordIdList: string[]) {
		if (!wordIdList.length) return false;

		const wordCount = await this.wordRepository
			.createQueryBuilder('word')
			.where('word.id IN (:...wordIdList)', { wordIdList })
			.select(['word.id'])
			.getCount();

		return wordCount === wordIdList.length;
	}

	async findByIdListWithUserLike({
		wordIdList,
		userId,
	}: {
		wordIdList: string[];
		userId?: string;
	}) {
		if (!wordIdList.length) return [];

		const queryBuilder = this.wordRepository
			.createQueryBuilder('word')
			.leftJoin('word.likes', 'like')
			.where('word.id IN (:...wordIdList)', { wordIdList })
			.select([
				'word.id',
				'word.name',
				'word.diacritic',
				'word.pronunciation',
			]);

		if (userId) {
			queryBuilder
				.addSelect([
					'SUM(CASE WHEN like.userId = :userId THEN 1 ELSE 0 END) > 0 AS isLike',
				])
				.setParameters({ userId });
		} else {
			queryBuilder.addSelect(['false::boolean AS isLike']);
		}

		return await queryBuilder.groupBy('word.id').getRawMany();
	}

	async findByIdWithUserLike({
		wordId,
		userId,
	}: {
		wordId: string;
		userId?: string;
	}) {
		const queryBuilder = this.wordRepository
			.createQueryBuilder('word')
			.leftJoin('word.likes', 'like')
			.where('word.id = :wordId', { wordId })
			.select([
				'word.id',
				'word.name',
				'word.description',
				'word.diacritic',
				'word.pronunciation',
				'word.wrongPronunciations',
				'word.exampleSentence',
				'COUNT(like.id) AS likeCount',
			]);

		if (userId) {
			queryBuilder
				.addSelect([
					'SUM(CASE WHEN like.userId = :userId THEN 1 ELSE 0 END) > 0 AS isLike',
				])
				.setParameters({ userId });
		} else {
			queryBuilder.addSelect(['false::boolean AS isLike']);
		}

		return await queryBuilder.groupBy('word.id').getRawOne();
	}

	async findByNameWithUserLike({
		name,
		userId,
	}: {
		name: string;
		userId?: string;
	}) {
		const queryBuilder = this.wordRepository
			.createQueryBuilder('word')
			.leftJoin('word.likes', 'like')
			.where('word.name ILIKE :wordName', { wordName: name.toLowerCase() })
			.select([
				'word.id',
				'word.name',
				'word.description',
				'word.diacritic',
				'word.pronunciation',
				'word.wrongPronunciations',
				'word.exampleSentence',
				'COUNT(like.id) AS likeCount',
			]);

		if (userId) {
			queryBuilder
				.addSelect([
					'SUM(CASE WHEN like.userId = :userId THEN 1 ELSE 0 END) > 0 AS isLike',
				])
				.setParameters({ userId });
		} else {
			queryBuilder.addSelect(['false::boolean AS isLike']);
		}

		return await queryBuilder.groupBy('word.id').getRawOne();
	}

	async findWithList(requestWordListDto: RequestWordListDto) {
		const { userId, sorting } = requestWordListDto;
		const [sortOption, ascOrDesc] = WORD_SORTING_TYPE[sorting];

		const queryBuilder = this.wordRepository.createQueryBuilder('word');

		queryBuilder
			.leftJoin('word.likes', 'like')
			.select([
				'word.id',
				'word.name',
				'word.description',
				'word.diacritic',
				'word.pronunciation',
				'word.wrongPronunciations',
				'word.exampleSentence',
				'COUNT(like.id) AS likeCount',
			]);

		if (userId) {
			queryBuilder
				.addSelect([
					'SUM(CASE WHEN like.userId = :userId THEN 1 ELSE 0 END) > 0 AS isLike',
				])
				.setParameters({ userId });
		} else {
			queryBuilder.addSelect(['false::boolean AS isLike']);
		}

		const words = await queryBuilder
			.groupBy('word.id')
			.orderBy(sortOption, ascOrDesc)
			.offset(requestWordListDto.getSkip())
			.limit(requestWordListDto.limit)
			.getRawMany();

		const totalCount = await this.wordRepository
			.createQueryBuilder('word')
			.getCount();

		return {
			words,
			totalCount,
		};
	}

	async findUserLikeWord(requestWordListDto: RequestWordUserLikeDto) {
		const { userId, sorting } = requestWordListDto;
		const [sortOption, ascOrDesc] = WORD_SORTING_TYPE[sorting];

		const queryBuilder = this.wordRepository
			.createQueryBuilder('word')
			.innerJoin('word.likes', 'like')
			.innerJoin('like.user', 'user')
			.where('user.id = :userId', { userId })
			.select([
				'word.id',
				'word.name',
				'word.pronunciation',
				'word.diacritic',
				'word.description',
				'word.createdAt',
				'COUNT(like.id) AS likeCount',
			])
			.groupBy('word.id');

		const [words, totalCount] = await Promise.all([
			queryBuilder
				.orderBy(sortOption, ascOrDesc)
				.offset(requestWordListDto.getSkip())
				.limit(requestWordListDto.limit)
				.getRawMany(),
			queryBuilder.getCount(),
		]);

		return {
			words,
			totalCount,
		};
	}
}
