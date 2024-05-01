import {
	Logger,
	type MiddlewareConsumer,
	Module,
	NestModule,
} from '@nestjs/common';

import { GlobalConfigModule } from '#configs/setup.config';
import { GlobalTypeOrmModule } from '#configs/typeorm.configs';
import { LoggerMiddleware } from '#middlewares/logger.middleware';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WordModule } from './word/word.module';

@Module({
	imports: [GlobalConfigModule, GlobalTypeOrmModule, UserModule, AuthModule, WordModule],
	controllers: [AppController],
	providers: [AppService, Logger],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
