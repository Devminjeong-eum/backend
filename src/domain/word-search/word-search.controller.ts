import {
	Controller,
	Get,
	HttpStatus,
	Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { ApiDocs } from '#/shared/decorators/swagger.decorator';

import {
	RequestWordRelatedSearchDto,
	RequestWordSearchDto,
	ResponseWordRelatedSearchDto,
	ResponseWordSearchDto,
} from './dto';
import { WordSearchService } from './service/word-search.service';
import { User } from '#/shared/decorators/user.decorator';
import { UserData } from '#/shared/guard/user-role/request-with-user.interface';
import { UseRoleGuard } from '#/shared/guard/user-role';
import { UserRole } from '#/infrastructure/drizzle/constant/user-role.constant';

@ApiTags('WordSearch')
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
	@UseRoleGuard(UserRole.GUEST)
	@Get('/keyword')
	async findBySearchKeyword(
		@User() user: UserData,
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
