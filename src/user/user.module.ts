import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '#/databases/entities/user.entity';
import { UserRepository } from '#/databases/repositories/user.repository';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UserController],
	providers: [UserService, UserRepository],
})
export class UserModule {}
