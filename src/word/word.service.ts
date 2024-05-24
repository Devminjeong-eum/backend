import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { plainToInstance } from 'class-transformer';

import { SpreadSheetService } from '#/spread-sheet/spread-sheet.service';
import { WordRepository } from '#databases/repositories/word.repository';

import { RequestCreateWordDto } from './dto/create-word.dto';
import { RequestUpdateWordDto } from './dto/update-word.dto';
import { RequestWordDetailDto } from './dto/word-detail.dto';
import { RequestWordListDto } from './dto/word-list.dto';
import { RequestWordSearchDto } from './dto/word-search.dto';
import { RequestWordUserLikeDto } from './dto/word-user-like.dto';

@Injectable()
export class WordService {
	constructor(
		private readonly wordRepository: WordRepository,
		private readonly spreadSheetService: SpreadSheetService,
	) {}

	private SPREAD_SHEET_UUID_ROW = 'G';

	/**
	 * Spread Sheet 데이터를 파싱하여 DB 에 저장하는 매서드 updateWordList
	 */
	async updateWordList() {
		const parsedSheetDataList =
			await this.spreadSheetService.parseWordSpreadSheet();

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
				const insertedCellLocation = `${this.SPREAD_SHEET_UUID_ROW}${index}`;
				await this.spreadSheetService.insertCellData(
					'word',
					insertedCellLocation,
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

	async getWordById(wordDetailDto: RequestWordDetailDto) {
		const word =
			await this.wordRepository.findByIdWithUserLike(wordDetailDto);

		if (!word)
			throw new BadRequestException(
				`해당 ID 를 가진 Word 가 존재하지 않습니다.`,
			);
		return word;
	}

	async getWordByKeyword(requestWordSearchDto: RequestWordSearchDto) {
		return await this.wordRepository.findBySearchWord(requestWordSearchDto);
	}
}
