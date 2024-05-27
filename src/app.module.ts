import {
	Logger,
	type MiddlewareConsumer,
	Module,
	NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmConfig } from '#configs/typeorm.configs';
import { LoggerMiddleware } from '#middlewares/logger.middleware';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { LikeModule } from './like/like.module';
import { QuizModule } from './quiz/quiz.module';
import { UserModule } from './user/user.module';
import { WordModule } from './word/word.module';
import { DiscordWebhookModule } from './discord/discord.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
		}),
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmConfig,
		}),
		ScheduleModule.forRoot(),
		DiscordWebhookModule,
		UserModule,
		AuthModule,
		WordModule,
		LikeModule,
		QuizModule,
	],
	controllers: [AppController],
	providers: [Logger],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
