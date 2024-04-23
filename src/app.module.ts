import { Logger, type MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { LoggerMiddleware } from '#/middlewares/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	controllers: [AppController],
	providers: [AppService, Logger],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
