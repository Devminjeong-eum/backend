import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RequestWordRelatedSearchDto } from '#/word-search/dto/word-related-search.dto';
import { RequestWordSearchDto } from '#/word-search/dto/word-search.dto';
import { Word } from '#databases/entities/word.entity';
import { WordSearch } from '#databases/entities/word-search.entity';

@Injectable()
export class WordSearchRepository {
	constructor(
		@InjectRepository(WordSearch)
		private readonly wordSearchRepository: Repository<WordSearch>,
	) {}

	async create(word: Word, keyword: string) {
		const createdWordSearch = this.wordSearchRepository.create({ word, keyword });
		return await this.wordSearchRepository.save(createdWordSearch);
	}

	async updateKeyword(word: Word, keyword: string) {
		const result = await this.wordSearchRepository.update({ word }, { keyword });
		return result.raw;
	}

	async findByRelatedSearchWord(
		requestWordRelatedSearchDto: RequestWordRelatedSearchDto,
	) {
		const { keyword } = requestWordRelatedSearchDto;

		const [words, totalCount] = await this.wordSearchRepository
			.createQueryBuilder('wordSearch')
			.where('wordSearch.keyword like :keyword', { keyword: `${keyword}%` })
			.innerJoin('wordSearch.word', 'word')
			.select(['word.id', 'word.name', 'word.diacritic'])
			.skip(requestWordRelatedSearchDto.getSkip())
			.take(requestWordRelatedSearchDto.limit)
			.getManyAndCount();

		return { words, totalCount };
	}

	async findBySearchWord(requestWordSearchDto: RequestWordSearchDto) {
		const { keyword, userId } = requestWordSearchDto;

		const queryBuilder = this.wordSearchRepository
			.createQueryBuilder('wordSearch')
			.where('wordSearch.keyword like :keyword', { keyword: `${keyword}%` });

		const [words, totalCount] = await Promise.all([
			queryBuilder
				.innerJoin('wordSearch.word', 'word')
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
				.distinct(true)
				.offset(requestWordSearchDto.getSkip())
				.limit(requestWordSearchDto.limit)
				.getRawMany(),
			queryBuilder.getCount(),
		]);

		return { words, totalCount };
	}
}
