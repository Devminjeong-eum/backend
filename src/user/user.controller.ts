import { Body, Controller, Get, Param, Patch } from '@nestjs/common';

import { RequestChangeNicknameDto } from './dto/change-nickname.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':userId')
	findOne(@Param('userId') userId: string) {
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
