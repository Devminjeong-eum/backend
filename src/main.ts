import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { winstonLogger } from '#/configs/logger.config';
import { setupSwaggerModule } from '#/configs/swagger.config';
import { setupExceptionFilter } from '#/middlewares/http-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true,
		logger: winstonLogger,
	});

	setupSwaggerModule(app);
	setupExceptionFilter(app);

	await app.listen(8080);
}
bootstrap();
