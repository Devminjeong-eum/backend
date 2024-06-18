import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { plainToInstance } from 'class-transformer';

import { PaginationDto, PaginationMetaDto } from '#/common/dto/pagination.dto';
import { SpreadSheetService } from '#/spread-sheet/spread-sheet.service';
import { WordRepository } from '#databases/repositories/word.repository';

import { RequestCreateWordDto } from './dto/create-word.dto';
import { RequestUpdateWordDto } from './dto/update-word.dto';
import {
	RequestWordDetailDto,
	ResponseWordDetailDto,
} from './dto/word-detail.dto';
import { RequestWordListDto, ResponseWordListDto } from './dto/word-list.dto';
import {
	RequestWordUserLikeDto,
	ResponseWordUserLikeDto,
} from './dto/word-user-like.dto';

@Injectable()
export class WordService {
	constructor(
		private readonly wordRepository: WordRepository,
		private readonly spreadSheetService: SpreadSheetService,
	) {}

	private SPREAD_SHEET_UUID_ROW = 'G';
	private readonly SPREAD_SHEET_NAME = 'word';
	private readonly UUID_REGEX =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	private readonly NAME_REGEX = /^[a-z0-9]+$/i;

	private parseWordFromSpreadSheet = (
		[
			name,
			description,
			diacritic,
			pronunciation,
			wrongPronunciations,
			exampleSentence,
			uuid,
		]: string[],
		index: number,
	) => ({
		name: name.toLowerCase(),
		description,
		diacritic: diacritic.split(','),
		pronunciation: pronunciation.split(',').map((word) => word.trim()),
		wrongPronunciations: wrongPronunciations
			.split(',')
			.map((word) => word.trim()),
		exampleSentence,
		uuid,
		index: index + 2, // NOTE : SpreadSheet 의 경우 2번부터 단어 시작
	});

	async updateWordList() {
		const parsedSheetDataList =
			await this.spreadSheetService.parseSpreadSheet({
				sheetName: this.SPREAD_SHEET_NAME,
				range: 'A2:Z',
				parseCallback: this.parseWordFromSpreadSheet,
			});

		if (!parsedSheetDataList.length) return true;

		for await (const {
			uuid,
			index,
			...wordInformation
		} of parsedSheetDataList) {
			const isExist = await this.wordRepository.findByName(
				wordInformation.name,
			);

			const wordEntity = isExist
				? await this.wordRepository.update(
						uuid,
						plainToInstance(RequestUpdateWordDto, wordInformation),
					)
				: await this.wordRepository.create(
						plainToInstance(RequestCreateWordDto, wordInformation),
					);

			if (!isExist) {
				await this.spreadSheetService.insertCellData({
					sheetName: this.SPREAD_SHEET_NAME,
					range: `${this.SPREAD_SHEET_UUID_ROW}${index}`,
					value: wordEntity.id,
				});
			}
		}

		return true;
	}

	@Cron(CronExpression.EVERY_12_HOURS, {
		name: 'update-word-list',
		timeZone: 'Asia/Seoul',
	})
	async updateWordListBatch() {
		return await this.updateWordList();
	}

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

		if (searchType === 'NAME' && !searchValue.match(this.NAME_REGEX)) {
			throw new BadRequestException(
				'searchType 이 NAME 인 경우 searchValue 에는 유효한 단어 명이 와야 합니다.',
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
