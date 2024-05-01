import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { google } from 'googleapis';

import { PaginationOptionDto } from '#/common/dto/pagination.dto';
import { WordRepository } from '#databases/repositories/word.repository';

@Injectable()
export class WordService {
	constructor(
		private readonly wordRepository: WordRepository,
		private readonly configService: ConfigService,
	) {}

	async getWordSpreadSheet() {
		const privateKey = this.configService
			.get<string>('GOOGLE_PRIVATE_KEY')!
			.replace(/\\n/g, '\n');

		const authorize = new google.auth.JWT({
			email: this.configService.get<string>('GOOGLE_API_EMAIL'),
			key: privateKey,
			scopes: ['https://www.googleapis.com/auth/spreadsheets'],
		});

		const googleSheet = google.sheets({
			version: 'v4',
			auth: authorize,
		});

		const context = await googleSheet.spreadsheets.values.get({
			spreadsheetId: this.configService.get<string>(
				'GOOGLE_SPREAD_SHEET_ID',
			),
			range: `A2:F${100}`,
		});

		return context.data.values;
	}

	async getWordList(paginationOptionDto: PaginationOptionDto) {
		return await this.wordRepository.findWithList(paginationOptionDto);
	}
}
