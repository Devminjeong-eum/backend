import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import cookieParser from 'cookie-parser';
import type { Application } from 'express';

import { DiscordWebhookService } from '#/infrastructure/discord/service/discord.service';
import { ValidationException } from '#/shared/exceptions/ValidationException';
import { ApiResponseInterceptor } from '#/shared/middlewares/api-response.interceptor';
import { HttpExceptionFilter } from '#/shared/middlewares/http-exception.filter';

export const setupNestApplication = (app: INestApplication) => {
	app.use(cookieParser());
	app.enableCors({ origin: true, credentials: true });

	/**
	 * API Validation Pipeline
	 */
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			exceptionFactory: (errors) => new ValidationException(errors),
		}),
	);

	/**
	 * Server Exception Filter
	 */
	const discordWebhookService = app.get(DiscordWebhookService);
	app.useGlobalFilters(new HttpExceptionFilter(discordWebhookService));

	/**
	 * API Response Format Interceptor
	 */
	app.useGlobalInterceptors(new ApiResponseInterceptor());

	/**
	 * Swagger Setting
	 */
	const config = new DocumentBuilder()
		.setTitle('Devminjeong-eum')
		.setDescription('데브말ㅆㆍ미 | 개발 용어 발음 사전')
		.setVersion('1.0.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-docs', app, document);

	/**
	 * Disable non-security Header
	 */
	const expressApp: Application = app.getHttpAdapter().getInstance();
	expressApp.disable('x-powered-by');
	expressApp.disable('Server');
};
