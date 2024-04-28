import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '#/user/user.module';
import { JsonWebTokenModule } from '#configs/jwt.config';
import { User } from '#databases/entities/user.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticationGuard } from './guard/auth.guard';
import { KakaoStrategy } from './strategies/kakao-auth.strategy';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule,
		JsonWebTokenModule,
		UserModule,
	],
	controllers: [AuthController],
	providers: [
		// Service
		AuthService,
		// Strategy
		KakaoStrategy,
		// Guard
		AuthenticationGuard,
		KakaoAuthGuard,
	],
	exports: [JsonWebTokenModule, AuthService, AuthenticationGuard],
})
export class AuthModule {}
