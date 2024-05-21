import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { plainToInstance } from 'class-transformer';

import { SpreadSheetService } from '#/spread-sheet/spread-sheet.service';
import { RequestCreateUserDto } from '#/user/dto/create-user.dto';
import { WordRepository } from '#databases/repositories/word.repository';

import { RequestUpdateWordDto } from './dto/update-word.dto';
import { RequestWordListDto } from './dto/word-list.dto';
import { RequestWordSearchDto } from './dto/word-search.dto';
import { RequestWordUserLikeDto } from './dto/word-user-like.dto';

@Injectable()
export class WordService {
	constructor(
		private readonly wordRepository: WordRepository,
		private readonly spreadSheetService: SpreadSheetService,
	) {}

	/**
	 * Google Spread SHeet 에서 단어 목록을 파싱하는 메서드 parseWordSpreadSheet
	 */
	private async parseWordSpreadSheet() {
		const sheetCellList =
			(await this.spreadSheetService.getRangeCellData()) ?? [];

		if (!sheetCellList.length) return [];

		const parseResult =
			sheetCellList.map(
				(
					[
						name,
						description,
						diacritic,
						pronunciation,
						wrongPronunciations,
						exampleSentence,
						uuid,
					],
					index,
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
				},
			) ?? [];

		return parseResult;
	}

	/**
	 * Spread Sheet 데이터를 파싱하여 DB 에 저장하는 매서드 updateWordList
	 */
	async updateWordList() {
		const parsedSheetDataList = await this.parseWordSpreadSheet();
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
						plainToInstance(RequestCreateUserDto, wordInformation),
					);

			if (!isExist) {
				await this.spreadSheetService.insertCellData(
					`G${index}`,
					wordEntity.id,
				);
			}
		}

		return true;
	}

	@Cron(CronExpression.EVERY_3_HOURS, {
		name: 'update-spread-sheets',
		timeZone: 'Asia/Seoul',
	})
	async updateWordListBatch() {
		return await this.updateWordList();
	}

	async getWordList(wordListDto: RequestWordListDto) {
		return await this.wordRepository.findWithList(wordListDto);
	}

	async getWordUserLike(wordUserLikeDto: RequestWordUserLikeDto) {
		return await this.wordRepository.findUserLikeWord(wordUserLikeDto);
	}

	async getWordById(wordId: string) {
		const word = await this.wordRepository.findById(wordId);

		if (!word)
			throw new BadRequestException(
				`${wordId} id 를 가진 Word 가 존재하지 않습니다.`,
			);
		return word;
	}

	async getWordByKeyword(requestWordSearchDto: RequestWordSearchDto) {
		return await this.wordRepository.findBySearchWord(requestWordSearchDto);
	}
}
