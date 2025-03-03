import type { NestModule } from '@nestjs/common';
import { Logger, type MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { WinstonModule } from 'nest-winston';

import { AuthModule } from '#/domain/auth/auth.module';
import { LikeModule } from '#/domain/like/like.module';
import { QuizModule } from '#/domain/quiz/quiz.module';
import { RankingModule } from '#/domain/ranking/ranking.module';
import { ResearchModule } from '#/domain/research/research.module';
import { TextToSpeechModule } from '#/domain/text-to-speech/text-to-speech.module';
import { UserModule } from '#/domain/user/user.module';
import { WordSearchModule } from '#/domain/word-search/word-search.module';
import { WordModule } from '#/domain/word/word.module';
import { DiscordWebhookModule } from '#/infrastructure/discord/discord.module';
import { DrizzleModule } from '#/infrastructure/drizzle/drizzle.module';
import { RedisModule } from '#/infrastructure/redis/redis.module';
import { winstonLoggerConfig } from '#/shared/configs/logger.config';
import { LoggerMiddleware } from '#/shared/middlewares/logger.middleware';
import { UserRoleGuard } from '#/shared/guard/user-role';

import { AppController } from './app.controller';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `./src/config/.env.${process.env.NODE_ENV}`,
		}),
		DrizzleModule.forRoot(),
		RedisModule.forRootAsync(),
		WinstonModule.forRoot(winstonLoggerConfig),
		ScheduleModule.forRoot(),
		DiscordWebhookModule,
		UserModule,
		AuthModule,
		WordModule,
		LikeModule,
		RankingModule,
		QuizModule,
		ResearchModule,
		WordSearchModule,
		TextToSpeechModule,
	],
	controllers: [AppController],
	providers: [Logger, UserRoleGuard],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
