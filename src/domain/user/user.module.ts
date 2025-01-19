import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from '#/domain/auth/auth.module';
import { JwtConfig } from '#/domain/auth/config/jwt.config';
import { UserRepository } from '#/infrastructure/drizzle/repository/user.repository';

import { UserInformationInterceptor } from './interceptors/user-information.interceptor';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';

@Module({
	imports: [
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
