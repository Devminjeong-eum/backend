import { Controller, Delete, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserRole } from '#/infrastructure/drizzle/constant/user-role.constant';
import { ApiDocs } from '#/shared/decorators/swagger.decorator';
import { User } from '#/shared/decorators/user.decorator';
import { UseRoleGuard } from '#/shared/guard/user-role';
import { UserData } from '#/shared/guard/user-role/request-with-user.interface';

import { RequestCreateLikeDto, RequestRevertLikeDto } from './dto';
import { LikeService } from './service/like.service';

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
	@UseRoleGuard(UserRole.USER)
	applyLike(
		@User() user: UserData,
		@Param() { wordId }: RequestCreateLikeDto,
	) {
		return this.likeService.applyUserLike({ wordId, userId: user.id });
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
	@UseRoleGuard(UserRole.USER)
	revertLike(
		@User() user: UserData,
		@Param() { wordId }: RequestRevertLikeDto,
	) {
		return this.likeService.revertUserLike({ wordId, userId: user.id });
	}
}
