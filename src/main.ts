import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { winstonLogger } from '#configs/logger.config';

import { AppModule } from './app.module';
import { setupNestApplication } from './common/configs/setup.config';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true,
		logger: winstonLogger,
	});

	setupNestApplication(app);

	const configService = app.get(ConfigService);
	const port = configService.get<number>('SERVER_PORT') || 3000;

	await app.listen(port, '0.0.0.0');
}
bootstrap();
