import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import { DataSource, Repository } from 'typeorm';

import { PaginationDto, PaginationMetaDto } from '#/common/dto/pagination.dto';
import { RequestCreateWordDto } from '#/word/dto/create-word.dto';
import { RequestUpdateWordDto } from '#/word/dto/update-word.dto';
import {
	RequestWordDetailDto,
	ResponseWordDetailDto,
} from '#/word/dto/word-detail.dto';
import {
	RequestWordListDto,
	ResponseWordListDto,
} from '#/word/dto/word-list.dto';
import {
	RequestWordSearchDto,
	ResponseWordSearchDto,
} from '#/word/dto/word-search.dto';
import {
	RequestWordUserLikeDto,
	ResponseWordUserLikeDto,
} from '#/word/dto/word-user-like.dto';
import { WORD_SORTING_TYPE } from '#/word/interface/word-list-sorting.interface';
import { Word } from '#databases/entities/word.entity';

@Injectable()
export class WordRepository {
	constructor(
		@InjectRepository(Word)
		private readonly wordRepository: Repository<Word>,
		private readonly dataSource: DataSource,
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

	async findByIdListWithUserLike({
		wordIdList,
		userId,
	}: {
		wordIdList: string[];
		userId?: string;
	}) {
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
			queryBuilder.addSelect(['false AS isLike']);
		}

		return await queryBuilder.groupBy('word.id').getRawMany();
	}

	async findByIdWithUserLike(wordDetailDto: RequestWordDetailDto) {
		const { wordId, userId } = wordDetailDto;

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
			queryBuilder.addSelect(['false AS isLike']);
		}

		const word = await queryBuilder.groupBy('word.id').getRawOne();

		const responseWordDetailDto = plainToInstance(
			ResponseWordDetailDto,
			word,
			{ excludeExtraneousValues: true },
		);
		return responseWordDetailDto;
	}

	async findBySearchWord(requestWordSearchDto: RequestWordSearchDto) {
		const { keyword, userId } = requestWordSearchDto;

		const queryBuilder = this.wordRepository
			.createQueryBuilder('word')
			.where('word.name like :keyword', { keyword: `${keyword}%` });

		const [words, totalCount] = await Promise.all([
			queryBuilder
				.leftJoinAndSelect(
					'word.likes',
					'like',
					userId ? 'like.userId = :userId' : '',
					{ userId },
				)
				.select([
					'word.id',
					'word.name',
					'word.pronunciation',
					'word.diacritic',
					'word.description',
					'word.createdAt',
					'CASE WHEN like.id IS NOT NULL THEN true ELSE false END AS isLike',
				])
				.orderBy('word.createdAt', 'ASC')
				.offset(requestWordSearchDto.getSkip())
				.limit(requestWordSearchDto.limit)
				.getRawMany(),
			queryBuilder.getCount(),
		]);

		const paginationMeta = new PaginationMetaDto({
			paginationOption: requestWordSearchDto,
			totalCount,
		});

		const responseWordSearchDto = plainToInstance(
			ResponseWordSearchDto,
			words,
			{ excludeExtraneousValues: true },
		);

		return new PaginationDto(responseWordSearchDto, paginationMeta);
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
			queryBuilder.addSelect(['false AS isLike']);
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

		const responseWordListDto = plainToInstance(
			ResponseWordListDto,
			words,
			{ excludeExtraneousValues: true },
		);

		const paginationMeta = new PaginationMetaDto({
			paginationOption: requestWordListDto,
			totalCount,
		});

		return new PaginationDto(responseWordListDto, paginationMeta);
	}

	async findUserLikeWord(requestWordListDto: RequestWordUserLikeDto) {
		const { userId } = requestWordListDto;

		const [words, totalCount] = await this.wordRepository
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
			])
			.orderBy('word.createdAt', 'ASC')
			.skip(requestWordListDto.getSkip())
			.take(requestWordListDto.limit)
			.getManyAndCount();

		const paginationMeta = new PaginationMetaDto({
			paginationOption: requestWordListDto,
			totalCount,
		});

		const responseWordListDto = plainToInstance(
			ResponseWordUserLikeDto,
			words,
		);

		return new PaginationDto(responseWordListDto, paginationMeta);
	}
}
