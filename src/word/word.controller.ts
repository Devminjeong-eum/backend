import {
	Controller,
	Get,
	HttpStatus,
	Patch,
	Query,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { AuthenticatedUser } from '#/auth/decorator/auth.decorator';
import { AdminGuard } from '#/auth/guard/admin.guard';
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
		summary:
			'특정 단어의 상세 정보를 ID 혹은 이름으로 검색하여 열람합니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseWordDetailDto,
		},
	})
	@Get('/detail')
	@UseInterceptors(UserInformationInterceptor)
	async findById(
		@AuthenticatedUser() user: User,
		@Query() requestWordDetailDto: RequestWordDetailDto,
	) {
		const wordDetailDto = plainToInstance(RequestWordDetailDto, {
			userId: user?.id,
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
	@UseGuards(AdminGuard)
	async patchUpdateSpreadSheet() {
		return await this.wordService.updateWordList();
	}
}
