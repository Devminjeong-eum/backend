import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import { DataSource, Repository } from 'typeorm';

import { PaginationDto, PaginationMetaDto } from '#/common/dto/pagination.dto';
import { RequestCreateUserDto } from '#/user/dto/create-user.dto';
import { RequestUpdateWordDto } from '#/word/dto/update-word.dto';
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
import { Word } from '#/databases/entities/word.entity';

@Injectable()
export class WordRepository {
	constructor(
		@InjectRepository(Word)
		private readonly wordRepository: Repository<Word>,
		private readonly dataSource: DataSource,
	) {}

	async create(createWordDto: RequestCreateUserDto) {
		const registeredUser = this.wordRepository.create(createWordDto);
		return await this.wordRepository.save(registeredUser);
	}

	async update(id: string, updateFieldDto: RequestUpdateWordDto) {
		const result = await this.wordRepository.update({ id }, updateFieldDto);
		return result.raw as Word;
	}

	findByName(name: string) {
		return this.wordRepository.findOneBy({ name });
	}

	findById(id: string) {
		return this.wordRepository.findOneBy({ id });
	}

	async findBySearchWord(requestWordSearchDto: RequestWordSearchDto) {
		const { keyword, userId } = requestWordSearchDto;

		const queryBuilder = this.wordRepository
			.createQueryBuilder('word')
			.where('word.name like :keyword', { keyword: `${keyword}%` });

		const totalCount = await queryBuilder.getCount();

		const paginationMeta = new PaginationMetaDto({
			paginationOption: requestWordSearchDto,
			totalCount,
		});

		const words = await queryBuilder
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
			.skip(requestWordSearchDto.getSkip())
			.take(requestWordSearchDto.limit)
			.getRawMany();

		const responseWordSearchDto = plainToInstance(
			ResponseWordSearchDto,
			words,
			{ excludeExtraneousValues: true },
		);

		return new PaginationDto(responseWordSearchDto, paginationMeta);
	}

	async findWithList(requestWordListDto: RequestWordListDto) {
		const { userId } = requestWordListDto;
		const totalCount = this.dataSource.getMetadata(Word).columns.length;

		const paginationMeta = new PaginationMetaDto({
			paginationOption: requestWordListDto,
			totalCount,
		});

		const words = await this.wordRepository
			.createQueryBuilder('word')
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
			.skip(paginationMeta.skip)
			.take(paginationMeta.limit)
			.getRawMany();

		const responseWordListDto = plainToInstance(
			ResponseWordListDto,
			words,
			{ excludeExtraneousValues: true },
		);

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
