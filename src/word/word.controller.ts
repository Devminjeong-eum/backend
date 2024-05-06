import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { Word } from '#/common/databases/entities/word.entity';
import {
	PaginationDto,
	PaginationOptionDto,
} from '#/common/dto/pagination.dto';

import { WordService } from './word.service';

@Controller('word')
export class WordController {
	constructor(private readonly wordService: WordService) {}

	@ApiOperation({
		summary: '현재 등록된 단어 목록을 조회합니다.',
	})
	@ApiQuery({
		name: 'page',
		required: false,
		description: '요청할 페이지',
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		description: '페이지 당 요청할 자료 수',
	})
	@ApiResponse({
		status: 200,
		description: '요청 성공시',
		type: PaginationDto<Word>,
	})
	@Get('/list')
	async findAll(@Query() paginationOptionDto: PaginationOptionDto) {
		return await this.wordService.getWordList(paginationOptionDto);
	}

	@ApiOperation({
		summary: '특정 키워드에 부합하는 단어 목록을 조회합니다.',
	})
	@ApiQuery({
		name: 'keyword',
		required: false,
		description: '검색 키워드',
	})
	@ApiQuery({
		name: 'page',
		required: false,
		description: '요청할 페이지',
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		description: '페이지 당 요청할 자료 수',
	})
	@ApiResponse({
		status: 200,
		description: '요청 성공시',
		type: PaginationDto<Word>,
	})
	@Get('/search')
	async findBySearch(
		@Query('keyword') keyword: string,
		@Query() paginationOptionDto: PaginationOptionDto,
	) {
		return await this.wordService.getWordByKeyword(
			keyword,
			paginationOptionDto,
		);
	}

	@ApiOperation({
		summary: '특정 Word Id 를 가진 단어의 상세 정보를 열람합니다.',
	})
	@ApiParam({
		name: 'wordId',
		required: false,
		description: '조회할 Word UUID (id)',
	})
	@ApiResponse({
		status: 200,
		description: '요청 성공시',
	})
	@Get('/:wordId')
	async findById(@Param('wordId') wordId: string) {
		return await this.wordService.getWordById(wordId);
	}

	@ApiOperation({
		summary:
			'데브말싸미 Google Spread Sheet 를 기반으로 단어 목록을 갱신합니다..',
	})
	@ApiResponse({
		status: 200,
		type: Boolean,
		description: '요청 성공시',
	})
	@Patch('/spread-sheet')
	async patchUpdateSpreadSheet() {
		return await this.wordService.updateWordList();
	}
}
