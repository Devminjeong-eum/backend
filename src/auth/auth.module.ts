import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JsonWebTokenModule } from '#/configs/jwt.config';
import { User } from '#/databases/entities/user.entity';
import { UserModule } from '#/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticationGuard } from './guard/auth.guard';
import { KakaoStrategy } from './strategies/kakao-auth.strategy';

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
	],
	exports: [JsonWebTokenModule, AuthService, AuthenticationGuard],
})
export class AuthModule {}
