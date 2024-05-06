import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JWT } from 'google-auth-library';
import { google } from 'googleapis';

@Injectable()
export class SpreadConnectService {
	constructor(private readonly configService: ConfigService) {}

	public getGoogleAuthorize(): JWT {
		const key = this.configService
			.get<string>('GOOGLE_PRIVATE_KEY')!
			.replace(/\\n/g, '\n');

		const email = this.configService.get<string>('GOOGLE_API_EMAIL');

		return new google.auth.JWT({
			email,
			key,
			scopes: ['https://www.googleapis.com/auth/spreadsheets'],
		});
	}
}
