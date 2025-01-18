import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { WordSearchRepository } from '#/infrastructure/database/repositories/word-search.repository';
import { PaginationDto, PaginationMetaDto } from '#/shared/dto/pagination.dto';

import type {
	RequestWordRelatedSearchDto} from '../dto/word-related-search.dto';
import {
	ResponseWordRelatedSearchDto,
} from '../dto/word-related-search.dto';
import type {
	RequestWordSearchDto} from '../dto/word-search.dto';
import {
	ResponseWordSearchDto,
} from '../dto/word-search.dto';

@Injectable()
export class WordSearchService {
	constructor(private readonly wordSearchRepository: WordSearchRepository) {}

	async getWordByKeyword(requestWordSearchDto: RequestWordSearchDto) {
		const { words, totalCount } =
			await this.wordSearchRepository.findBySearchWord(
				requestWordSearchDto,
			);

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

	async getWordByRelatedKeyword(
		requestWordRelatedSearchDto: RequestWordRelatedSearchDto,
	) {
		const { words, totalCount } =
			await this.wordSearchRepository.findByRelatedSearchWord(
				requestWordRelatedSearchDto,
			);

		const paginationMeta = new PaginationMetaDto({
			paginationOption: requestWordRelatedSearchDto,
			totalCount,
		});

		const responseWordRelatedSearchDto = plainToInstance(
			ResponseWordRelatedSearchDto,
			words,
			{ excludeExtraneousValues: true },
		);

		return new PaginationDto(responseWordRelatedSearchDto, paginationMeta);
	}
}
