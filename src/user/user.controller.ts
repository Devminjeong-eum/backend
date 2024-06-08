import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthenticatedUser } from '#/auth/decorator/auth.decorator';
import { AuthenticationGuard } from '#/auth/guard/auth.guard';
import { ApiDocs } from '#/common/decorators/swagger.decorator';
import { User } from '#databases/entities/user.entity';

import { RequestChangeNicknameDto } from './dto/change-nickname.dto';
import { ResponseUserInformationDto } from './dto/user-information.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiDocs({
		summary: '자기 자신의 유저 정보를 열람합니다',
		response: {
			statusCode: HttpStatus.OK,
			schema: User,
		},
	})
	@Get()
	@UseGuards(AuthenticationGuard)
	getOwnInformation(@AuthenticatedUser() user: User) {
		const { id: userId } = user;
		return this.userService.getUserInformation(userId);
	}

	@ApiDocs({
		summary: '특정 ID 를 가진 유저 정보를 조회합니다',
		params: {
			name: 'userId',
			required: true,
			description: '조회할 유저 UUID (id)',
		},
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseUserInformationDto,
		},
	})
	@Get(':userId')
	getUserInformation(
		@Param('userId', new ParseUUIDPipe({ version: undefined }))
		userId: string,
	) {
		return this.userService.getUserInformation(userId);
	}

	@ApiDocs({
		summary: '유저를 조회한 후 회원탈퇴를 진행합니다.',
		params: {
			name: 'userId',
			required: true,
			description: '탈퇴를 진행할 유저 UUID (id)',
		},
		response: {
			statusCode: HttpStatus.OK,
			schema: Boolean,
		},
	})
	@Delete(':userId')
	unregisterUser(
		@Param('userId', new ParseUUIDPipe({ version: undefined }))
		userId: string,
	) {
		return this.userService.getUserInformation(userId);
	}

	@ApiDocs({
		summary: '특정 ID 를 가진 유저의 닉네임을 수정합니다',
	})
	@Patch('/nickname')
	patchChangeNickname(
		@Body() requestChangeNicknameDto: RequestChangeNicknameDto,
	) {
		return this.userService.changeUserNickname(requestChangeNicknameDto);
	}
}
