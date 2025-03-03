import { Controller, Get, HttpStatus, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { UserRole } from '#/infrastructure/drizzle/constant/user-role.constant';
import { ApiDocs } from '#/shared/decorators/swagger.decorator';
import { User } from '#/shared/decorators/user.decorator';
import { UseRoleGuard } from '#/shared/guard/user-role';
import { UserData } from '#/shared/guard/user-role/request-with-user.interface';

import {
	RequestWordDetailDto,
	RequestWordListDto,
	RequestWordUserLikeDto,
	ResponseWordDetailDto,
	ResponseWordListDto,
	ResponseWordUserLikeDto,
} from './dto';
import { WordUpdateBatchService } from './service/word-update-batch.service';
import { WordService } from './service/word.service';

@ApiTags('Word')
@Controller('word')
export class WordController {
	constructor(
		private readonly wordService: WordService,
		private readonly wordUpdateBatchService: WordUpdateBatchService,
	) {}

	@ApiDocs({
		summary: '현재 등록된 단어 목록을 조회합니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseWordListDto,
			isPaginated: true,
		},
	})
	@UseRoleGuard(UserRole.GUEST)
	@Get('/list')
	async findAll(
		@User() user: UserData<false>,
		@Query() wordListDto: RequestWordListDto,
	) {
		const requestWordListDto = plainToInstance(
			RequestWordListDto,
			{
				userId: user.id,
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
	@UseRoleGuard(UserRole.USER)
	@Get('/like')
	async findUserLike(
		@User() user: UserData,
		@Query() requestWordUserDto: RequestWordUserLikeDto,
	) {
		const wordUserLikeDto = plainToInstance(RequestWordUserLikeDto, {
			...requestWordUserDto,
			userId: user.id,
		});
		return await this.wordService.getWordUserLike(wordUserLikeDto);
	}

	@ApiDocs({
		summary:
			'특정 단어의 상세 정보를 ID 혹은 이름으로 검색하여 열람합니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseWordDetailDto,
		},
	})
	@Get('/detail')
	@UseRoleGuard(UserRole.GUEST)
	async findById(
		@User() user: UserData<false>,
		@Query() requestWordDetailDto: RequestWordDetailDto,
	) {
		const wordDetailDto = plainToInstance(RequestWordDetailDto, {
			userId: user.id,
			...requestWordDetailDto,
		});
		return await this.wordService.getWordDetail(wordDetailDto);
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
	@UseRoleGuard(UserRole.ADMIN)
	async patchUpdateSpreadSheet() {
		return await this.wordUpdateBatchService.updateWordList();
	}
}
