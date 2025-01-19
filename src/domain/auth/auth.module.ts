import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtConfig } from '#/domain/auth/config/jwt.config';
import { UserModule } from '#/domain/user/user.module';
import { User } from '#/infrastructure/database/entities/user.entity';

import { AuthController } from './auth.controller';
import { AdminGuard } from './guard/admin.guard';
import { AuthenticationGuard } from './guard/auth.guard';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { AuthTokenService } from './service/auth-token.service';
import { SocialAuthService } from './service/social-auth.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
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
	],
	exports: [SocialAuthService, AuthenticationGuard],
})
export class AuthModule {}
