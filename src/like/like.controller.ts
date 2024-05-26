import { Controller, Delete, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthenticatedUser } from '#/auth/decorator/auth.decorator';
import { AuthenticationGuard } from '#/auth/guard/auth.guard';
import { ApiDocs } from '#/common/decorators/swagger.decorator';
import { User } from '#databases/entities/user.entity';

import { RequestCreateLikeDto } from './dto/create-like.dto';
import { RequestRevertLikeDto } from './dto/revert-like.dto';
import { LikeService } from './like.service';

@ApiTags('Like')
@Controller('like')
export class LikeController {
	constructor(private readonly likeService: LikeService) {}

	@ApiDocs({
		summary: '특정 단어에 대한 좋아요 처리를 진행합니다.',
		params: {
			name: 'wordId',
			required: true,
			description: '좋아요를 누른 Word UUID (id)',
		},
	})
	@Patch(':wordId')
	@UseGuards(AuthenticationGuard)
	applyLike(
		@AuthenticatedUser() user: User,
		@Param() createLikeDto: RequestCreateLikeDto,
	) {
		return this.likeService.applyUserLike(createLikeDto, user);
	}

	@ApiDocs({
		summary: '특정 단어에 대한 좋아요 취소를 진행합니다.',
		params: {
			name: 'wordId',
			required: true,
			description: '좋아요를 취소한 Word UUID (id)',
		},
	})
	@Delete(':wordId')
	@UseGuards(AuthenticationGuard)
	revertLike(
		@AuthenticatedUser() user: User,
		@Param() revertLikeDto: RequestRevertLikeDto,
	) {
		return this.likeService.revertUserLike(revertLikeDto, user);
	}
}
