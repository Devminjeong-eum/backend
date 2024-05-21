import {
	Controller,
	Get,
	Param,
	Patch,
	Query,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { AuthenticatedUser } from '#/auth/decorator/auth.decorator';
import { AuthenticationGuard } from '#/auth/guard/auth.guard';
import {
	PaginationDto,
	PaginationOptionDto,
} from '#/common/dto/pagination.dto';
import { UserInformationInterceptor } from '#/user/interceptors/user-information.interceptor';
import { User } from '#databases/entities/user.entity';
import { Word } from '#databases/entities/word.entity';

import { RequestWordListDto, ResponseWordListDto } from './dto/word-list.dto';
import { RequestWordSearchDto } from './dto/word-search.dto';
import {
	RequestWordUserLikeDto,
	ResponseWordUserLikeDto,
} from './dto/word-user-like.dto';
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
		type: PaginationDto<ResponseWordListDto>,
	})
	@UseInterceptors(UserInformationInterceptor)
	@Get('/list')
	async findAll(
		@AuthenticatedUser() user: User,
		@Query() paginationOptionDto: PaginationOptionDto,
	) {
		const requestWordListDto = plainToInstance(RequestWordListDto, {
			userId: user.id,
			page: paginationOptionDto.page,
			limit: paginationOptionDto.limit,
		});
		return await this.wordService.getWordList(requestWordListDto);
	}

	@ApiOperation({
		summary: '유저가 좋아요를 누른 단어 목록을 조회합니다.',
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
		type: PaginationDto<ResponseWordUserLikeDto>,
	})
	@UseGuards(AuthenticationGuard)
	@Get('/like')
	async findUserLike(
		@AuthenticatedUser() user: User,
		@Query() paginationOptionDto: PaginationOptionDto,
	) {
		const wordUserLikeDto = plainToInstance(RequestWordUserLikeDto, {
			userId: user.id,
			page: paginationOptionDto.page,
			limit: paginationOptionDto.limit,
		});
		return await this.wordService.getWordUserLike(wordUserLikeDto);
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
	@UseInterceptors(UserInformationInterceptor)
	@Get('/search')
	async findBySearch(
		@AuthenticatedUser() user: User,
		@Query('keyword') keyword: string,
		@Query() paginationOptionDto: PaginationOptionDto,
	) {
		const wordSearchDto = plainToInstance(RequestWordSearchDto, {
			keyword,
			userId: user.id,
			page: paginationOptionDto.page,
			limit: paginationOptionDto.limit,
		});

		return await this.wordService.getWordByKeyword(wordSearchDto);
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
