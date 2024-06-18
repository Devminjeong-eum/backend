import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
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

	private async getSheetIdByName(sheetName: string) {
		const sheets = this.getGoogleSheetConnect();
		const response = await sheets.spreadsheets.get({
			spreadsheetId: this.spreadSheetId,
		});

		const sheet = response.data.sheets?.find(
			(sheet) => sheet.properties?.title === sheetName,
		);
		return sheet ? sheet.properties?.sheetId || null : null;
	}

	private a1ToGridRange(a1Notation: string, sheetId: number) {
		const match = a1Notation.match(/^([A-Z]+)(\d+)$/);

		if (!match) {
			throw new BadRequestException('유효하지 않은 A1 표기법입니다.');
		}

		const column =
			match[1]
				.split('')
				.reduce(
					(result, char) =>
						result * 26 +
						char.charCodeAt(0) -
						'A'.charCodeAt(0) +
						1,
					0,
				) - 1;
		const row = parseInt(match[2], 10) - 1;

		return {
			sheetId,
			startRowIndex: row,
			endRowIndex: row + 1,
			startColumnIndex: column,
			endColumnIndex: column + 1,
		};
	}

	async getRangeCellData({
		sheetName,
		range,
	}: {
		sheetName: string;
		range: string;
	}) {
		const sheets = this.getGoogleSheetConnect();
		const selectedRange = `${sheetName}-${process.env.NODE_ENV}!${range}`;

		const rangeCells = await sheets.spreadsheets.values.get({
			spreadsheetId: this.spreadSheetId,
			range: selectedRange,
		});

		const rangeCellValues: string[][] = rangeCells.data.values ?? [];

		return rangeCellValues;
	}

	async insertCellData({
		sheetName,
		range,
		value,
	}: {
		sheetName: string;
		range: string;
		value: string;
	}) {
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

	async insertRow({
		sheetName,
		range,
		value,
	}: {
		sheetName: string;
		range: string;
		value: any[][];
	}) {
		const sheets = this.getGoogleSheetConnect();
		const response = await sheets.spreadsheets.values.update({
			spreadsheetId: this.spreadSheetId,
			range: `${sheetName}-${process.env.NODE_ENV}!${range}`,
			valueInputOption: 'USER_ENTERED',
			requestBody: {
				values: value,
			},
		});
		return response.data.updatedCells ?? 0;
	}

	async appendRow({
		sheetName,
		range,
		row,
	}: {
		sheetName: string;
		range: string;
		row: any[][];
	}) {
		const sheets = this.getGoogleSheetConnect();
		const response = await sheets.spreadsheets.values.append({
			spreadsheetId: this.spreadSheetId,
			range: `${sheetName}-${process.env.NODE_ENV}!${range}`,
			valueInputOption: 'USER_ENTERED',
			insertDataOption: 'INSERT_ROWS',
			requestBody: {
				values: row,
			},
		});
		return response.data.updates?.updatedCells ?? 0;
	}

	async batchUpdate({
		sheetName,
		updatedCells,
	}: {
		sheetName: string;
		updatedCells: { cell: string; data: any }[];
	}) {
		const sheets = this.getGoogleSheetConnect();
		const sheetId = await this.getSheetIdByName(
			`${sheetName}-${process.env.NODE_ENV}`,
		);

		if (!sheetId) {
			throw new BadRequestException(
				`${sheetName} 이름을 가진 시트는 존재하지 않습니다.`,
			);
		}

		const requests = updatedCells.map((updatedCell) => ({
			updateCells: {
				range: this.a1ToGridRange(updatedCell.cell, sheetId),
				rows: [
					{
						values: [
							{
								userEnteredValue: {
									stringValue: updatedCell.data,
								},
							},
						],
					},
				],
				fields: 'userEnteredValue',
			},
		}));

		const response = await sheets.spreadsheets.batchUpdate({
			spreadsheetId: this.spreadSheetId,
			requestBody: {
				requests,
			},
		});

		return response.data;
	}

	async parseSpreadSheet<T extends (...args: any[]) => any>({
		sheetName,
		range,
		parseCallback,
	}: {
		sheetName: string;
		range: string;
		parseCallback: T;
	}): Promise<Array<ReturnType<T>>> {
		const sheetCellList = await this.getRangeCellData({ sheetName, range });
		return sheetCellList.length ? sheetCellList.map(parseCallback) : [];
	}
}
