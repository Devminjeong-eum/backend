import type {
	CanActivate,
	ExecutionContext} from '@nestjs/common';
import {
	ForbiddenException,
	Injectable,
} from '@nestjs/common';

import { AuthService } from '#/domain/auth/service/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private readonly authService: AuthService) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const adminUser = await this.authService.checkIsAdminRequest(request);

		if (!adminUser) {
			throw new ForbiddenException(
				'해당 요청은 어드민만 접근이 가능합니다.',
			);
		}

		request.user = adminUser;
		return true;
	}
}
