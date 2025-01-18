import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { WinstonModule } from 'nest-winston';

import { winstonLoggerConfig } from '#/shared/configs/logger.config';

import { AppModule } from './app.module';
import { setupNestApplication } from './shared/configs/setup.config';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true,
		logger: WinstonModule.createLogger(winstonLoggerConfig),
	});

	setupNestApplication(app);

	const configService = app.get(ConfigService);
	const port = configService.getOrThrow<number>('SERVER_PORT') || 3000;

	await app.listen(port, '0.0.0.0');
}
bootstrap();
