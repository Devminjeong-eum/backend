import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import * as cookieParser from 'cookie-parser';

import { winstonLogger } from '#configs/logger.config';
import { setupSwaggerModule } from '#configs/swagger.config';
import { ApiResponseInterceptor } from '#middlewares/api-response.interceptor';
import { HttpExceptionFilter } from '#middlewares/http-exception.filter';

import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true,
		logger: winstonLogger,
	});

	const configService = app.get(ConfigService);
	const port = configService.get<number>('SERVER_PORT') || 3000;

	setupSwaggerModule(app);

	app.use(cookieParser());
	app.enableCors({ origin: true, credentials: true });
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalInterceptors(new ApiResponseInterceptor());

	await app.listen(port);
}
bootstrap();
