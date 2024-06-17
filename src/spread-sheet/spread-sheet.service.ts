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
