import { Controller, Get, Query } from '@nestjs/common';

import { PaginationOptionDto } from '#/common/dto/pagination.dto';

import { WordService } from './word.service';

@Controller('word')
export class WordController {
	constructor(private readonly wordService: WordService) {}

	@Get()
	async findAll(@Query() paginationOptionDto: PaginationOptionDto) {
		console.log(paginationOptionDto);
    const wordList =
			await this.wordService.getWordList(paginationOptionDto);
		return wordList;
	}
}
