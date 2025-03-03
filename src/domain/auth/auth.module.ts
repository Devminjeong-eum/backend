import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtConfig } from '#/domain/auth/config/jwt.config';
import { UserModule } from '#/domain/user/user.module';
import { UserRepository } from '#/infrastructure/drizzle/repository/user.repository';

import { AuthController } from './auth.controller';
import { AuthTokenService } from './service/auth-token.service';
import { KakaoAuthService } from './service/kakao-auth.service';

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
		KakaoAuthService,
		// Config
		JwtConfig,
		// Repository
		UserRepository,
	],
	exports: [JwtModule],
})
export class AuthModule {}
