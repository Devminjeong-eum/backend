import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { SpreadSheetService } from '#/spread-sheet/spread-sheet.service';

import { RequestResearchBeforeQuitDto } from './dto/research-before-quit.dto';

@Injectable()
export class ResearchService {
	constructor(private readonly spreadSheetService: SpreadSheetService) {}

	private readonly SPREAD_SHEET_NAME = 'researchQuit';

	async sendBeforeQuitResearch(
		researchBeforeQuitDto: RequestResearchBeforeQuitDto,
	) {
		const {
			userId,
			userName,
			question1,
			question2 = '',
		} = researchBeforeQuitDto;

		const appendResult = await this.spreadSheetService.appendRow({
			sheetName: this.SPREAD_SHEET_NAME,
			range: `A:D`,
			row: [[userName, userId, question1, question2]],
		});

		if (!appendResult) {
			throw new InternalServerErrorException(
				'SpreadSheet 에 데이터를 추가하는 과정에서 에러가 발생했습니다.',
			);
		}

		return true;
	}
}
