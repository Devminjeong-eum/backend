import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JsonWebTokenModule } from '#/configs/jwt.config';
import { User } from '#/databases/entities/user.entity';
import { UserRepository } from '#/databases/repositories/user.repository';
import { UserModule } from '#/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KakaoStrategy } from './strategies/kakao-auth.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule,
		JsonWebTokenModule,
		UserModule,
	],
	controllers: [AuthController],
	providers: [AuthService, KakaoStrategy, UserRepository],
})
export class AuthModule {}
