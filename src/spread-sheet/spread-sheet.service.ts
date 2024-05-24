import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JWT } from 'google-auth-library';
import { google, sheets_v4 } from 'googleapis';

import { SpreadConnectService } from './spread-connect.service';

@Injectable()
export class SpreadSheetService {
	private readonly jwtClient: JWT;
	private readonly spreadSheetId: string;

	constructor(
		private readonly configService: ConfigService,
		private readonly spreadConnectService: SpreadConnectService,
	) {
		const spreadSheetId = this.configService.get<string>(
			'GOOGLE_SPREAD_SHEET_ID',
		);

		if (!spreadSheetId) {
			throw new InternalServerErrorException(
				'GOOGLE_SPREAD_SHEET_ID 가 누락되었습니다.',
			);
		}

		this.jwtClient = this.spreadConnectService.getGoogleAuthorize();
		this.spreadSheetId = spreadSheetId;
	}

	private getGoogleSheetConnect(): sheets_v4.Sheets {
		return google.sheets({ version: 'v4', auth: this.jwtClient });
	}

	async getRangeCellData(sheetName: string, range: string) {
		const sheets = this.getGoogleSheetConnect();
		const rangeCells = await sheets.spreadsheets.values.get({
			spreadsheetId: this.spreadSheetId,
			range: `${sheetName}-${process.env.NODE_ENV}!${range}`,
		});

		const rangeCellValues: string[][] = rangeCells.data.values ?? [];

		return rangeCellValues;
	}

	async insertCellData(sheetName: string, range: string, value: string) {
		const sheets = this.getGoogleSheetConnect();
		const response = await sheets.spreadsheets.values.update({
			spreadsheetId: this.spreadSheetId,
			range: `${sheetName}-${process.env.NODE_ENV}!${range}`,
			valueInputOption: 'RAW',
			requestBody: {
				values: [[value]],
			},
		});

		return response.data.updatedCells ?? 0;
	}

	async parseWordSpreadSheet() {
		const spreadSheetRange = `word-${process.env.NODE_ENV}!A2:Z`;
		const sheetCellList = await this.getRangeCellData('word', spreadSheetRange);

		if (!sheetCellList?.length) return [];

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

	async parseQuizSelectionSheet() {
		const spreadSheetRange = `${process.env.NODE_ENV}-QuizSelection!A2:Z`;
		const sheetCellList = await this.getRangeCellData('quizSelection', spreadSheetRange);

		if (!sheetCellList?.length) return [];

		const parseResult =
			sheetCellList.map(
				(
					[
						name,
						correct,
						rawIncorrectList,
						quizSelectionId,
					],
					index,
				) => {
					const incorrectList = rawIncorrectList
						.split(',')
						.map((word) => word.trim());

					return {
						name,
						correct,
						incorrectList,
						quizSelectionId,
						index: index + 2, // NOTE : SpreadSheet 의 경우 2번부터 단어 시작
					};
				},
			) ?? [];

		return parseResult;
	}
}
