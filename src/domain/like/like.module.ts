import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '#/domain/auth/auth.module';
import { Like } from '#/infrastructure/database/entities/like.entity';
import { User } from '#/infrastructure/database/entities/user.entity';
import { Word } from '#/infrastructure/database/entities/word.entity';
import { LikeRepository } from '#/infrastructure/database/repositories/like.repository';
import { UserRepository } from '#/infrastructure/database/repositories/user.repository';
import { WordRepository } from '#/infrastructure/database/repositories/word.repository';

import { LikeController } from './like.controller';
import { LikeService } from './service/like.service';

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
