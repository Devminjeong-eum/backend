import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from '#/auth/auth.service';
import { AuthenticationGuard } from '#/auth/guard/auth.guard';
import { User } from '#/databases/entities/user.entity';
import { UserRepository } from '#/databases/repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UserController],
	providers: [
		// Service
		UserService,
		JwtService,
		AuthService,
		// Repository
		UserRepository,
		// Guard
		AuthenticationGuard,
	],
})
export class UserModule {}
