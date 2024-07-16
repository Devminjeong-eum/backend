import {
	Logger,
	type MiddlewareConsumer,
	Module,
	NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WinstonLoggerModule } from '#/common/configs/logger.config';
import { TypeOrmConfig } from '#configs/typeorm.configs';
import { LoggerMiddleware } from '#middlewares/logger.middleware';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DiscordWebhookModule } from './discord/discord.module';
import { LikeModule } from './like/like.module';
import { QuizModule } from './quiz/quiz.module';
import { RankingModule } from './ranking/ranking.module';
import { RedisModule } from './redis/redis.module';
import { ResearchModule } from './research/research.module';
import { UserModule } from './user/user.module';
import { WordSearchModule } from './word-search/word-search.module';
import { WordModule } from './word/word.module';
import { TextToSpeechModule } from './text-to-speech/text-to-speech.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `./src/config/.env.${process.env.NODE_ENV}`,
		}),
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmConfig,
		}),
		RedisModule.forRootAsync(),
		WinstonLoggerModule,
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
	providers: [Logger],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
