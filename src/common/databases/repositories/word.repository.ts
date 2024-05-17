import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import {
	PaginationDto,
	PaginationMetaDto,
	PaginationOptionDto,
} from '#/common/dto/pagination.dto';
import { RequestCreateUserDto } from '#/user/dto/create-user.dto';
import { RequestUpdateWordDto } from '#/word/dto/update-word.dto';
import { RequestWordListDto } from '#/word/dto/word-list.dto';
import { Word } from '#databases/entities/word.entity';

@Injectable()
export class WordRepository {
	constructor(
		@InjectRepository(Word)
		private wordRepository: Repository<Word>,
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

	async findBySearchWord(
		wordListDto: RequestWordListDto,
		paginationOption: PaginationOptionDto,
	) {
		const { keyword, userId } = wordListDto;

		const [words, totalCount] = await this.wordRepository
			.createQueryBuilder('word')
			.orderBy('word.createdAt', 'ASC')
			.where('word.name like :keyword', { keyword: `${keyword}%` })
			.leftJoinAndSelect(
				'word.likes',
				'like',
				userId ? 'like.userId = :userId' : 'false', // NOTE : userId 가 존재하지 않을 경우 항상 False 로 추론
				{ userId },
			)
			.select([
				'word.id',
				'word.name',
				'word.pronunciation',
				'word.diacritic',
				'word.description',
				'CASE WHEN like.id IS NOT NULL THEN true ELSE false END AS isLike',
			])
			.skip(paginationOption.getSkip())
			.take(paginationOption.limit)
			.getManyAndCount();

		const paginationMeta = new PaginationMetaDto({
			paginationOption,
			totalCount,
		});

		return new PaginationDto(words, paginationMeta);
	}

	async findWithList(paginationOption: PaginationOptionDto) {
		const totalCount = await this.wordRepository.countBy({});

		const paginationMeta = new PaginationMetaDto({
			paginationOption,
			totalCount,
		});

		const queryBuilder = this.wordRepository.createQueryBuilder('word');

		queryBuilder
			.orderBy('word.createdAt', 'ASC')
			.skip(paginationMeta.skip)
			.take(paginationMeta.limit)
			.select([
				'word.id',
				'word.name',
				'word.pronunciation',
				'word.diacritic',
				'word.description',
			]);

		const entities = await queryBuilder.getMany();

		return new PaginationDto(entities, paginationMeta);
	}
}
