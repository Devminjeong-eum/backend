import { BadRequestException, Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { WordRepository } from '#/infrastructure/drizzle/repository/word.repository';
import { PaginationDto, PaginationMetaDto } from '#/shared/dto/pagination.dto';

import type { RequestWordDetailDto } from '../dto/word-detail.dto';
import { ResponseWordDetailDto } from '../dto/word-detail.dto';
import type { RequestWordListDto } from '../dto/word-list.dto';
import { ResponseWordListDto } from '../dto/word-list.dto';
import type { RequestWordUserLikeDto } from '../dto/word-user-like.dto';
import { ResponseWordUserLikeDto } from '../dto/word-user-like.dto';

@Injectable()
export class WordService {
	constructor(private readonly wordRepository: WordRepository) {}

	private readonly UUID_REGEX =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

	async getWordList(requestWordListDto: RequestWordListDto) {
		const { words, totalCount } =
			await this.wordRepository.findWithList(requestWordListDto);

		const responseWordListDto = plainToInstance(ResponseWordListDto, words);
		const paginationMeta = new PaginationMetaDto({
			paginationOption: requestWordListDto,
			totalCount,
		});

		return new PaginationDto(responseWordListDto, paginationMeta);
	}

	async getWordUserLike(requestWordUserLikeDto: RequestWordUserLikeDto) {
		const { words, totalCount } =
			await this.wordRepository.findUserLikeWord(requestWordUserLikeDto);

		const responseWordUserLikeListDto = plainToInstance(
			ResponseWordUserLikeDto,
			words,
			{ excludeExtraneousValues: true },
		);
		const paginationMeta = new PaginationMetaDto({
			paginationOption: requestWordUserLikeDto,
			totalCount,
		});

		return new PaginationDto(responseWordUserLikeListDto, paginationMeta);
	}

	async getWordDetail(wordDetailDto: RequestWordDetailDto) {
		const { searchType, searchValue, userId } = wordDetailDto;

		if (searchType === 'ID' && !searchValue.match(this.UUID_REGEX)) {
			throw new BadRequestException(
				'searchType 이 ID 인 경우 searchValue 에는 유효한 UUID 가 와야 합니다.',
			);
		}

		const word =
			searchType === 'ID'
				? await this.wordRepository.findByIdWithUserLike({
						wordId: searchValue,
						userId,
					})
				: await this.wordRepository.findByNameWithUserLike({
						name: searchValue.toLowerCase(),
						userId,
					});

		if (!word)
			throw new BadRequestException(
				`해당 조건에 맞는 단어가 존재하지 않습니다.`,
			);

		const responseWordDetailWithNameDto = plainToInstance(
			ResponseWordDetailDto,
			word,
			{ excludeExtraneousValues: true },
		);

		return responseWordDetailWithNameDto;
	}
}
