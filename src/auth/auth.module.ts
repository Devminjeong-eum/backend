import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '#/user/user.module';
import { JwtConfig } from '#configs/jwt.config';
import { User } from '#databases/entities/user.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticationGuard } from './guard/auth.guard';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { UserInformationInterceptor } from './interceptors/user-information.interceptor';

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
		AuthService,
		// Guard
		AuthenticationGuard,
		KakaoAuthGuard,
		// Interceptor
		UserInformationInterceptor,
	],
	exports: [AuthService, AuthenticationGuard, UserInformationInterceptor],
})
export class AuthModule {}
