import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Patch,
	Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { type CookieOptions, type Response } from 'express';

import { UserRole } from '#/infrastructure/drizzle/constant/user-role.constant';
import { ApiDocs } from '#/shared/decorators/swagger.decorator';
import { User } from '#/shared/decorators/user.decorator';
import { UseRoleGuard } from '#/shared/guard/user-role';
import { UserData } from '#/shared/guard/user-role/request-with-user.interface';

import { RequestChangeNicknameDto } from './dto/change-nickname.dto';
import { ResponseUserInformationDto } from './dto/user-information.dto';
import { UserService } from './service/user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	private readonly ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
	private readonly REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
	private AUTH_COOKIE_OPTION: CookieOptions = {
		secure: true,
		sameSite: 'none',
		httpOnly: true,
		path: '/',
		domain: '.dev-malssami.site',
	};

	@ApiDocs({
		summary: '자기 자신의 유저 정보를 열람합니다',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseUserInformationDto,
		},
	})
	@Get()
	@UseRoleGuard(UserRole.USER)
	getOwnInformation(@User() user: UserData) {
		const { id: userId } = user;
		return this.userService.getUserInformation({ userId });
	}

	@ApiDocs({
		summary: '특정 ID 를 가진 유저 정보를 조회합니다',
		params: {
			name: 'userId',
			required: true,
			description: '정보를 조회할 유저 ID',
		},
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseUserInformationDto,
		},
	})
	@Get(':userId')
	@UseRoleGuard(UserRole.USER)
	getUserInformation(@Param('userId') userId: string) {
		return this.userService.getUserInformation({ userId });
	}

	@ApiDocs({
		summary: '유저를 조회한 후 회원탈퇴를 진행합니다.',
		params: {
			name: 'userId',
			required: true,
			description: '탈퇴를 진행할 유저 ID',
		},
	})
	@UseRoleGuard(UserRole.USER)
	@Delete(':userId')
	unregisterUser(
		@Param('userId') userId: string,
		@Res({ passthrough: true }) response: Response,
	) {
		response.cookie(this.ACCESS_TOKEN_COOKIE_NAME, '', {
			...this.AUTH_COOKIE_OPTION,
			maxAge: 0,
		});
		response.cookie(this.REFRESH_TOKEN_COOKIE_NAME, '', {
			...this.AUTH_COOKIE_OPTION,
			maxAge: 0,
		});

		return this.userService.removeUserInformation(userId);
	}

	@ApiDocs({
		summary: '특정 ID 를 가진 유저의 닉네임을 수정합니다',
	})
	@UseRoleGuard(UserRole.USER)
	@Patch('/nickname')
	patchChangeNickname(
		@Body() requestChangeNicknameDto: RequestChangeNicknameDto,
	) {
		return this.userService.changeUserNickname(requestChangeNicknameDto);
	}
}
