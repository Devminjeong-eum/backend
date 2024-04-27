import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { AuthenticatedUser } from '#/auth/decorator/auth.decorator';
import { AuthenticationGuard } from '#/auth/guard/auth.guard';
import { User } from '#/databases/entities/user.entity';
import { RequestChangeNicknameDto } from './dto/change-nickname.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@UseGuards(AuthenticationGuard)
	getOwnInformation(@AuthenticatedUser() user: User) {
		const { id: userId } = user;
		console.log(user);
		return this.userService.getUserInformation(userId);
	}

	@Get(':userId')
	@UseGuards(AuthenticationGuard)
	getUserInformation(@Param('userId') userId: string) {
		return this.userService.getUserInformation(userId);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() requestChangeNicknameDto: RequestChangeNicknameDto,
	) {
		return this.userService.changeUserNickname(requestChangeNicknameDto);
	}
}
