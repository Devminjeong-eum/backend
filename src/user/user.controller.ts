import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthenticatedUser } from '#/auth/decorator/auth.decorator';
import { AuthenticationGuard } from '#/auth/guard/auth.guard';
import { User } from '#databases/entities/user.entity';

import { RequestChangeNicknameDto } from './dto/change-nickname.dto';
import { ResponseUserInformationDto } from './dto/user-information.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({
		summary: '자기 자신의 유저 정보를 열람합니다',
	})
	@ApiResponse({
		status: 200,
		description: '요청 성공 시 받을 응답',
		type: ResponseUserInformationDto,
	})
	@Get()
	@UseGuards(AuthenticationGuard)
	getOwnInformation(@AuthenticatedUser() user: User) {
		const { id: userId } = user;
		return this.userService.getUserInformation(userId);
	}

	@Get(':userId')
	getUserInformation(@Param('userId') userId: string) {
		return this.userService.getUserInformation(userId);
	}

	@Patch(':userId')
	patchChangeNickname(
		@Body() requestChangeNicknameDto: RequestChangeNicknameDto,
	) {
		return this.userService.changeUserNickname(requestChangeNicknameDto);
	}
}
