import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '#/auth/auth.module';
import { JsonWebTokenModule } from '#configs/jwt.config';
import { User } from '#databases/entities/user.entity';
import { UserRepository } from '#databases/repositories/user.repository';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JsonWebTokenModule,
		// TODO : forwardRef 를 피할 수 있는 방법을 찾아보기
		forwardRef(() => AuthModule),
	],
	controllers: [UserController],
	providers: [
		// Service
		UserService,
		// Repository
		UserRepository,
	],
	exports: [UserService, UserRepository],
})
export class UserModule {}
