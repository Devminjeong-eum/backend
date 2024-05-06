import { Controller, Get, Param, Patch, Query } from '@nestjs/common';

import { PaginationOptionDto } from '#/common/dto/pagination.dto';

import { WordService } from './word.service';

@Controller('word')
export class WordController {
	constructor(private readonly wordService: WordService) {}

	@Get()
	async findAll(@Query() paginationOptionDto: PaginationOptionDto) {
		return await this.wordService.getWordList(paginationOptionDto);
	}

	@Get(':wordId')
	async findById(@Param('wordId') wordId: string) {
		return await this.wordService.getWordById(wordId);
	}

	@Patch('/spread-sheet')
	async patchUpdateSpreadSheet() {
		return await this.wordService.updateWordList();
	}
}
