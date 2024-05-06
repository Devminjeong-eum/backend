import {
	Logger,
	type MiddlewareConsumer,
	Module,
	NestModule,
} from '@nestjs/common';

import {
	GlobalConfigModule,
	GlobalScheduleModule,
} from '#configs/setup.config';
import { GlobalTypeOrmModule } from '#configs/typeorm.configs';
import { LoggerMiddleware } from '#middlewares/logger.middleware';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WordModule } from './word/word.module';

@Module({
	imports: [
		GlobalConfigModule,
		GlobalTypeOrmModule,
		GlobalScheduleModule,
		UserModule,
		AuthModule,
		WordModule,
	],
	controllers: [AppController],
	providers: [Logger],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
