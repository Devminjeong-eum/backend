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

	async getRangeCellData() {
		const sheets = this.getGoogleSheetConnect();
		const rangeCells = await sheets.spreadsheets.values.get({
			spreadsheetId: this.spreadSheetId,
			range: `${process.env.NODE_ENV}!A2:Z`,
		});

		const rangeCellValues: string[][] =
			rangeCells.data.values ?? [];

		return rangeCellValues;
	}

	async insertCellData(range: string, value: string) {
		const sheets = this.getGoogleSheetConnect();
		const response = await sheets.spreadsheets.values.update({
			spreadsheetId: this.spreadSheetId,
			range: `${process.env.NODE_ENV}!${range}`,
			valueInputOption: 'RAW',
			requestBody: {
				values: [[value]],
			},
		});

		return response.data.updatedCells ?? 0;
	}
}
