import { Module } from '@nestjs/common';

import { AuthModule } from '#/domain/auth/auth.module';
import { LikeRepository } from '#/infrastructure/drizzle/repository/like.repository';
import { UserRepository } from '#/infrastructure/drizzle/repository/user.repository';
import { WordRepository } from '#/infrastructure/drizzle/repository/word.repository';

import { LikeController } from './like.controller';
import { LikeService } from './service/like.service';

@Module({
	imports: [AuthModule],
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
