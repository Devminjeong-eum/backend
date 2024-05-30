import {
	Controller,
	Get,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Query,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { AuthenticatedUser } from '#/auth/decorator/auth.decorator';
import { AuthenticationGuard } from '#/auth/guard/auth.guard';
import { ApiDocs } from '#/common/decorators/swagger.decorator';
import { UserInformationInterceptor } from '#/user/interceptors/user-information.interceptor';
import { User } from '#databases/entities/user.entity';

import {
	RequestWordDetailDto,
	ResponseWordDetailDto,
} from './dto/word-detail.dto';
import { RequestWordListDto, ResponseWordListDto } from './dto/word-list.dto';
import {
	RequestWordRelatedSearchDto,
	ResponseWordRelatedSearchDto,
} from './dto/word-related-search.dto';
import {
	RequestWordSearchDto,
	ResponseWordSearchDto,
} from './dto/word-search.dto';
import {
	RequestWordUserLikeDto,
	ResponseWordUserLikeDto,
} from './dto/word-user-like.dto';
import { WordService } from './word.service';

@ApiTags('Word')
@Controller('word')
export class WordController {
	constructor(private readonly wordService: WordService) {}

	@ApiDocs({
		summary: '현재 등록된 단어 목록을 조회합니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseWordListDto,
			isPaginated: true,
		},
	})
	@UseInterceptors(UserInformationInterceptor)
	@Get('/list')
	async findAll(
		@AuthenticatedUser() user: User,
		@Query() wordListDto: RequestWordListDto,
	) {
		const requestWordListDto = plainToInstance(
			RequestWordListDto,
			{
				userId: user?.id,
				...wordListDto,
			},
			{ exposeDefaultValues: true },
		);

		return await this.wordService.getWordList(requestWordListDto);
	}

	@ApiDocs({
		summary: '유저가 좋아요를 누른 단어 목록을 조회합니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseWordUserLikeDto,
			isPaginated: true,
		},
	})
	@UseGuards(AuthenticationGuard)
	@Get('/like')
	async findUserLike(
		@AuthenticatedUser() user: User,
		@Query() requestWordUserDto: RequestWordUserLikeDto,
	) {
		const wordUserLikeDto = plainToInstance(RequestWordUserLikeDto, {
			...requestWordUserDto,
			userId: user.id,
		});
		return await this.wordService.getWordUserLike(wordUserLikeDto);
	}

	@ApiDocs({
		summary: '특정 키워드와 연관된 단어 목록을 조회합니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseWordRelatedSearchDto,
			isPaginated: true,
		},
	})
	@Get('/search/related')
	async findByRelatedSearch(
		@Query() requestWordRelatedSearchDto: RequestWordRelatedSearchDto,
	) {
		return await this.wordService.getWordByRelatedKeyword(
			requestWordRelatedSearchDto,
		);
	}

	@ApiDocs({
		summary: '특정 키워드 검색에 대한 단어 목록을 조회합니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseWordSearchDto,
			isPaginated: true,
		},
	})
	@UseInterceptors(UserInformationInterceptor)
	@Get('/search')
	async findBySearch(
		@AuthenticatedUser() user: User,
		@Query() requestWordSearchDto: RequestWordSearchDto,
	) {
		const wordSearchDto = plainToInstance(RequestWordSearchDto, {
			userId: user?.id,
			keyword: requestWordSearchDto.keyword,
			page: requestWordSearchDto.page,
			limit: requestWordSearchDto.limit,
		});

		return await this.wordService.getWordByKeyword(wordSearchDto);
	}

	@ApiDocs({
		summary: '특정 Word Id 를 가진 단어의 상세 정보를 열람합니다.',
		params: {
			name: 'wordId',
			required: true,
			description: '조회할 Word UUID (id)',
		},
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseWordDetailDto,
		},
	})
	@Get('/:wordId')
	@UseInterceptors(UserInformationInterceptor)
	async findById(
		@AuthenticatedUser() user: User,
		@Param('wordId', new ParseUUIDPipe({ version: undefined }))
		wordId: string,
	) {
		const wordDetailDto = plainToInstance(RequestWordDetailDto, {
			userId: user?.id,
			wordId,
		});
		return await this.wordService.getWordById(wordDetailDto);
	}

	@ApiDocs({
		summary:
			'데브말싸미 Google Spread Sheet 를 기반으로 단어 목록을 갱신합니다.',
		headers: {
			name: 'Authorization',
			required: true,
			description: '어드민 전용 Api Key',
		},
	})
	@Patch('/spread-sheet')
	async patchUpdateSpreadSheet() {
		return await this.wordService.updateWordList();
	}
}
