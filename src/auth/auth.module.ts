import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JsonWebTokenModule } from '#/configs/jwt.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KakaoStrategy } from './strategies/kakao-auth.strategy';

@Module({
	imports: [PassportModule, JsonWebTokenModule],
	controllers: [AuthController],
	providers: [AuthService, KakaoStrategy],
})
export class AuthModule {}
