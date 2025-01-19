import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { plainToInstance } from 'class-transformer';

import { TextToSpeechService } from '#/domain/text-to-speech/service/text-to-speech.service';
import { WordSearchRepository } from '#/infrastructure/database/repositories/word-search.repository';
import { WordRepository } from '#/infrastructure/database/repositories/word.repository';
import { SpreadSheetService } from '#/infrastructure/spread-sheet/spread-sheet.service';

import { RequestCreateWordDto } from '../dto/create-word.dto';

@Injectable()
export class WordUpdateBatchService {
	constructor(
		private readonly wordRepository: WordRepository,
		private readonly wordSearchRepository: WordSearchRepository,
		private readonly spreadSheetService: SpreadSheetService,
		private readonly textToSpeechService: TextToSpeechService,
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
		]: [string, string, string, string, string, string, string],
		index: number,
	) => ({
		name,
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

		const batchUpdatedList: { cell: string; data: string }[] = [];

		for await (const {
			uuid,
			index,
			...wordInformation
		} of parsedSheetDataList) {
			const wordName = wordInformation.name;
			const previousWord = await this.wordRepository.findByName(wordName);

			const searchKeyword = wordName.toLowerCase();

			if (!previousWord) {
				const createdWord = await this.wordRepository.create(
					plainToInstance(RequestCreateWordDto, wordInformation),
				);

				if (!createdWord) {
					throw new InternalServerErrorException(
						'단어 생성 중 오류가 발생했습니다.',
					);
				}

				await this.wordSearchRepository.create({
					wordId: createdWord.id,
					keyword: searchKeyword,
				});
				await this.textToSpeechService.createWordTextToSpeech({
					wordId: createdWord.id,
					text: createdWord.name,
				});
				batchUpdatedList.push({
					cell: `${this.SPREAD_SHEET_UUID_ROW}${index}`,
					data: createdWord.id,
				});
			} else {
				const updatedWord = await this.wordRepository.update({
					id: uuid,
					...wordInformation,
				});

				if (!updatedWord) {
					throw new InternalServerErrorException(
						'단어 갱신 중 오류가 발생했습니다.',
					);
				}
				await this.wordSearchRepository.updateKeyword({
					wordId: updatedWord.id,
					keyword: searchKeyword,
				});
			}
		}

		if (batchUpdatedList.length) {
			await this.spreadSheetService.batchUpdate({
				sheetName: this.SPREAD_SHEET_NAME,
				updatedCells: batchUpdatedList,
			});
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
}
