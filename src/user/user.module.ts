import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '#/auth/auth.module';
import { JwtConfig } from '#configs/jwt.config';
import { User } from '#databases/entities/user.entity';
import { UserRepository } from '#databases/repositories/user.repository';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';

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
	],
	exports: [UserService, UserRepository],
})
export class UserModule {}
