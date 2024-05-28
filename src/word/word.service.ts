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
	RequestWordSearchDto,
	ResponseWordSearchDto,
} from './dto/word-search.dto';
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
	) => {
		const diacriticList = diacritic.split(',');
		const pronunciationList = pronunciation
			.split(',')
			.map((word) => word.trim());
		const wrongPronunciationList = wrongPronunciations
			.split(',')
			.map((word) => word.trim());

		return {
			name,
			description,
			diacritic: diacriticList,
			pronunciation: pronunciationList,
			wrongPronunciations: wrongPronunciationList,
			exampleSentence,
			uuid,
			index: index + 2, // NOTE : SpreadSheet 의 경우 2번부터 단어 시작
		};
	};

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
		);
		const paginationMeta = new PaginationMetaDto({
			paginationOption: requestWordUserLikeDto,
			totalCount,
		});

		return new PaginationDto(responseWordUserLikeListDto, paginationMeta);
	}

	async getWordById(wordDetailDto: RequestWordDetailDto) {
		const word =
			await this.wordRepository.findByIdWithUserLike(wordDetailDto);

		if (!word)
			throw new BadRequestException(
				`해당 ID 를 가진 Word 가 존재하지 않습니다.`,
			);

		const responseWordDetailDto = plainToInstance(
			ResponseWordDetailDto,
			word,
			{ excludeExtraneousValues: true },
		);

		return responseWordDetailDto;
	}

	async getWordByKeyword(requestWordSearchDto: RequestWordSearchDto) {
		const { words, totalCount } =
			await this.wordRepository.findBySearchWord(requestWordSearchDto);

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
}
