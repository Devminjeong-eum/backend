import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Patch,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { type CookieOptions, type Response } from 'express';

import { AuthenticatedUser } from '#/domain/auth/decorator/auth.decorator';
import { AuthenticationGuard } from '#/domain/auth/guard/auth.guard';
import { UserEntity } from '#/infrastructure/drizzle/schema/user.schema';
import { ApiDocs } from '#/shared/decorators/swagger.decorator';

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
	@UseGuards(AuthenticationGuard)
	getOwnInformation(@AuthenticatedUser() user: UserEntity) {
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
	@UseGuards(AuthenticationGuard)
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
	@UseGuards(AuthenticationGuard)
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
	@UseGuards(AuthenticationGuard)
	@Patch('/nickname')
	patchChangeNickname(
		@Body() requestChangeNicknameDto: RequestChangeNicknameDto,
	) {
		return this.userService.changeUserNickname(requestChangeNicknameDto);
	}
}
