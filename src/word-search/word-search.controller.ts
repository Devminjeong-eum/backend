import {
	Controller,
	Get,
	HttpStatus,
	Query,
	UseInterceptors,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { AuthenticatedUser } from '#/auth/decorator/auth.decorator';
import { ApiDocs } from '#/common/decorators/swagger.decorator';
import { User } from '#/databases/entities/user.entity';
import { UserInformationInterceptor } from '#/user/interceptors/user-information.interceptor';

import {
	RequestWordRelatedSearchDto,
	ResponseWordRelatedSearchDto,
} from './dto/word-related-search.dto';
import {
	RequestWordSearchDto,
	ResponseWordSearchDto,
} from './dto/word-search.dto';
import { WordSearchService } from './word-search.service';

@Controller('search')
export class WordSearchController {
	constructor(private readonly wordSearchService: WordSearchService) {}

	@ApiDocs({
		summary: '특정 키워드와 연관된 단어 목록을 조회합니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseWordRelatedSearchDto,
			isPaginated: true,
		},
	})
	@Get('/related')
	async findByRelatedSearch(
		@Query() requestWordRelatedSearchDto: RequestWordRelatedSearchDto,
	) {
		return await this.wordSearchService.getWordByRelatedKeyword(
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
	@Get('/keyword')
	async findBySearchKeyword(
		@AuthenticatedUser() user: User,
		@Query() requestWordSearchDto: RequestWordSearchDto,
	) {
		const wordSearchDto = plainToInstance(RequestWordSearchDto, {
			userId: user?.id,
			keyword: requestWordSearchDto.keyword,
			page: requestWordSearchDto.page,
			limit: requestWordSearchDto.limit,
		});

		return await this.wordSearchService.getWordByKeyword(wordSearchDto);
	}
}
