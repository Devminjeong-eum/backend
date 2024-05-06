import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import {
	PaginationDto,
	PaginationMetaDto,
	PaginationOptionDto,
} from '#/common/dto/pagination.dto';
import { Word } from '#databases/entities/word.entity';

@Injectable()
export class WordRepository {
	constructor(
		@InjectRepository(Word)
		private wordRepository: Repository<Word>,
	) {}

	async create(word: Omit<Word, 'createdAt' | 'updatedAt' | 'id'>) {
		const registeredUser = this.wordRepository.create(word);
		return await this.wordRepository.save(registeredUser);
	}

	async update(
		id: string,
		updatedFieldData: Partial<Omit<Word, 'createdAt' | 'updatedAt' | 'id'>>,
	) {
		const result = await this.wordRepository.update(
			{ id },
			{ ...updatedFieldData },
		);
		return result.raw as Word;
	}

	findByName(name: string) {
		return this.wordRepository.findOneBy({ name });
	}

	findById(id: string) {
		return this.wordRepository.findOneBy({ id });
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
