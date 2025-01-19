import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { plainToInstance } from 'class-transformer';

import { QuizSelectionRepository } from '#/infrastructure/database/repositories/quiz-selection.repository';
import { WordRepository } from '#/infrastructure/database/repositories/word.repository';
import { SpreadSheetService } from '#/infrastructure/spread-sheet/spread-sheet.service';

import { RequestCreateQuizSelectDto } from '../dto/create-quiz-selection.dto';
import { RequestUpdateQuizSelectDto } from '../dto/update-quiz-selection.dto';

@Injectable()
export class QuizBatchUpdateService {
	constructor(
		private readonly spreadSheetService: SpreadSheetService,
		private readonly quizSelectionRepository: QuizSelectionRepository,
		private readonly wordRepository: WordRepository,
	) {}

	private readonly SPREAD_SHEET_UUID_ROW = 'E';
	private readonly SPREAD_SHEET_NAME = 'quizSelection';

	private readonly parseQuizSelectionFromSheet = (
		[name, wordId, correct, rawIncorrectList, uuid]: string[],
		index: number,
	) => {
		const isInvalidSpreadSheetRow =
			!name || !wordId || !correct || !uuid || !rawIncorrectList;

		if (isInvalidSpreadSheetRow) {
			throw new BadRequestException(
				`SpreadSheet 의 ${index + 2}번째 줄 일부에 값이 비어있습니다.`,
			);
		}

		const incorrectList =
			rawIncorrectList?.split(',').map((word) => word.trim()) ?? [];

		return {
			name,
			wordId,
			correct,
			incorrectList,
			uuid,
			index: index + 2, // NOTE : SpreadSheet 의 경우 2번부터 단어 시작
		};
	};

	async updateQuizSelectionList() {
		const parsedSheetDataList =
			await this.spreadSheetService.parseSpreadSheet({
				sheetName: this.SPREAD_SHEET_NAME,
				range: 'A2:Z',
				parseCallback: this.parseQuizSelectionFromSheet,
			});

		if (!parsedSheetDataList.length) return true;

		const batchUpdatedList: { cell: string; data: string }[] = [];

		for await (const {
			name,
			wordId,
			correct,
			incorrectList,
			uuid,
			index,
		} of parsedSheetDataList) {
			const word = await this.wordRepository.findById(wordId);

			if (!word) {
				throw new BadRequestException(
					`${name} 단어는 현재 Word 에 저장되어 있지 않습니다.`,
				);
			}

			const isExist =
				uuid && (await this.quizSelectionRepository.findById(uuid));

			const quizSelectionEntity = isExist
				? await this.quizSelectionRepository.update(
						uuid,
						plainToInstance(RequestUpdateQuizSelectDto, {
							correct,
							incorrectList,
						}),
					)
				: await this.quizSelectionRepository.create(
						word,
						plainToInstance(RequestCreateQuizSelectDto, {
							correct,
							incorrectList,
						}),
					);

			if (!isExist) {
				batchUpdatedList.push({
					cell: `${this.SPREAD_SHEET_UUID_ROW}${index}`,
					data: `${quizSelectionEntity.id}`,
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

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
		name: 'update-quiz-selections',
		timeZone: 'Asia/Seoul',
	})
	updateQuizSelectionListBatch() {
		return this.updateQuizSelectionList();
	}
}
