import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JWT } from 'google-auth-library';
import { google, sheets_v4 } from 'googleapis';

import { SpreadConnectService } from './spread-connect.service';

@Injectable()
export class SpreadSheetService {
	private readonly jwtClient: JWT;
	private loadedSpreadSheet: sheets_v4.Schema$Spreadsheet

	constructor(
		private readonly configService: ConfigService,
		private readonly spreadConnectService: SpreadConnectService,
	) {
		this.jwtClient = this.spreadConnectService.getGoogleAuthorize();
	}

	private getGoogleSheetConnect(): sheets_v4.Sheets {
		return google.sheets({ version: 'v4', auth: this.jwtClient });
	}

	async loadSpreadSheet() {
		const spreadSheetId = this.configService.get<string>(
			'GOOGLE_SPREAD_SHEET_ID',
		);

		if (!spreadSheetId)
			throw new InternalServerErrorException(
				'GOOGLE_SPREAD_SHEET_ID 가 누락되었습니다.',
			);

		const googleSheet = this.getGoogleSheetConnect();
		const spreadSheet = await googleSheet.spreadsheets.get({
			spreadsheetId: spreadSheetId,
			includeGridData: true,
		});

		this.loadedSpreadSheet = spreadSheet.data;
		return spreadSheet.data;
	}
}
