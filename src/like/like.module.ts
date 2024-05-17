import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '#/auth/auth.module';
import { Like } from '#databases/entities/like.entity';
import { User } from '#databases/entities/user.entity';
import { Word } from '#databases/entities/word.entity';
import { LikeRepository } from '#databases/repositories/like.repository';
import { UserRepository } from '#databases/repositories/user.repository';
import { WordRepository } from '#databases/repositories/word.repository';

import { LikeController } from './like.controller';
import { LikeService } from './like.service';

@Module({
	imports: [TypeOrmModule.forFeature([Like, User, Word]), AuthModule],
	controllers: [LikeController],
	providers: [
		// Service
		LikeService,
		// Repository
		LikeRepository,
		UserRepository,
		WordRepository,
	],
})
export class LikeModule {}
