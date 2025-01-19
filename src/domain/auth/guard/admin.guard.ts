import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Request } from 'express';

import type { User } from '#/infrastructure/database/entities/user.entity';
import { UserRepository } from '#/infrastructure/database/repositories/user.repository';

@Injectable()
export class AdminGuard implements CanActivate {
	private readonly TEST_ADMIN_KEY: string;
	constructor(
		private readonly configService: ConfigService,
		private readonly userRepository: UserRepository,
	) {
		this.TEST_ADMIN_KEY =
			this.configService.getOrThrow<string>('TEST_ADMIN_KEY');
	}

	async canActivate(context: ExecutionContext) {
		const request: Request & { user: User } = context
			.switchToHttp()
			.getRequest();
		const requestAdminKey = request.headers.authorization;

		if (requestAdminKey !== this.TEST_ADMIN_KEY) return false;

		const adminUser = await this.userRepository.findById(
			this.TEST_ADMIN_KEY,
		);

		if (!adminUser) return false;

		request.user = adminUser;
		return true;
	}
}
