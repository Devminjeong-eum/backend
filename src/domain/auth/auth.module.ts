import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtConfig } from '#/domain/auth/config/jwt.config';
import { UserModule } from '#/domain/user/user.module';
import { UserRepository } from '#/infrastructure/database/repositories/user.repository';

import { AuthController } from './auth.controller';
import { AdminGuard } from './guard/admin.guard';
import { AuthenticationGuard } from './guard/auth.guard';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { AuthTokenService } from './service/auth-token.service';
import { SocialAuthService } from './service/social-auth.service';

@Module({
	imports: [
		JwtModule.registerAsync({
			useClass: JwtConfig,
		}),
		UserModule,
	],
	controllers: [AuthController],
	providers: [
		// Service
		AuthTokenService,
		SocialAuthService,
		// Guard
		AuthenticationGuard,
		AdminGuard,
		KakaoAuthGuard,
		// Config
		JwtConfig,
		// Repository
		UserRepository,
	],
	exports: [AuthenticationGuard],
})
export class AuthModule {}
