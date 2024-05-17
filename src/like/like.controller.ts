import { Controller, Delete, Param, Patch, UseGuards } from '@nestjs/common';

import { AuthenticatedUser } from '#/auth/decorator/auth.decorator';
import { AuthenticationGuard } from '#/auth/guard/auth.guard';
import { User } from '#databases/entities/user.entity';

import { RequestCreateLikeDto } from './dto/create-like.dto';
import { RequestRevertLikeDto } from './dto/revert-like.dto';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
	constructor(private readonly likeService: LikeService) {}

	@Patch(':wordId')
	@UseGuards(AuthenticationGuard)
	applyLike(
		@AuthenticatedUser() user: User,
		@Param() createLikeDto: RequestCreateLikeDto,
	) {
		return this.likeService.applyUserLike(createLikeDto, user);
	}

	@Delete(':wordId')
	@UseGuards(AuthenticationGuard)
	revertLike(
		@AuthenticatedUser() user: User,
		@Param() revertLikeDto: RequestRevertLikeDto,
	) {
		return this.likeService.revertUserLike(revertLikeDto, user);
	}
}
