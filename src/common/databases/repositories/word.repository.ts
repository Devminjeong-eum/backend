import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RequestCreateUserDto } from '#/user/dto/create-user.dto';

import {
	PaginationDto,
	PaginationMetaDto,
	PaginationOptionDto,
} from '#/common/dto/pagination.dto';
import { Word } from '#databases/entities/word.entity';
import { RequestUpdateWordDto } from '#/word/dto/update-word.dto';

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

	async update(
		id: string,
		updateFieldDto: RequestUpdateWordDto,
	) {
		const result = await this.wordRepository.update(
			{ id },
			{ ...updateFieldDto },
		);
		return result.raw as Word;
	}

	findByName(name: string) {
		return this.wordRepository.findOneBy({ name });
	}

	findById(id: string) {
		return this.wordRepository.findOneBy({ id });
	}

	async findBySearchWord(
		keyword: string,
		paginationOption: PaginationOptionDto,
	) {
		const queryBuilder = this.wordRepository.createQueryBuilder('word');
		const skip = (paginationOption.page - 1) * paginationOption.limit;

		queryBuilder
			.orderBy('word.createdAt', 'ASC')
			.where('word.name like :keyword', { keyword: `${keyword}%` })
			.skip(skip)
			.take(paginationOption.limit)
			.select([
				'word.id',
				'word.name',
				'word.pronunciation',
				'word.diacritic',
				'word.description',
			]);

		const [entities, totalCount] = await queryBuilder.getManyAndCount();

		const paginationMeta = new PaginationMetaDto({
			paginationOption,
			totalCount,
		});

		return new PaginationDto(entities, paginationMeta);
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
