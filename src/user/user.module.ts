import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '#/auth/auth.module';
import { JwtConfig } from '#configs/jwt.config';
import { User } from '#databases/entities/user.entity';
import { UserRepository } from '#databases/repositories/user.repository';

import { UserInformationInterceptor } from './interceptors/user-information.interceptor';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.registerAsync({
			useClass: JwtConfig,
		}),
		// TODO : forwardRef 를 피할 수 있는 방법을 찾아보기
		forwardRef(() => AuthModule),
	],
	controllers: [UserController],
	providers: [
		// Service
		UserService,
		// Repository
		UserRepository,
		// Interceptor
		UserInformationInterceptor,
	],
	exports: [UserService, UserRepository, UserInformationInterceptor],
})
export class UserModule {}
