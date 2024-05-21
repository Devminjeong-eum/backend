import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as cookieParser from 'cookie-parser';

import { ApiResponseInterceptor } from '#middlewares/api-response.interceptor';
import { HttpExceptionFilter } from '#middlewares/http-exception.filter';

import { ValidationException } from '../exceptions/ValidationException';

export const setupNestApplication = (app: INestApplication) => {
	app.use(cookieParser());
	app.enableCors({ origin: true, credentials: true });
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			exceptionFactory: (errors) => new ValidationException(errors),
		}),
	);
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalInterceptors(new ApiResponseInterceptor());

	const config = new DocumentBuilder()
		.setTitle('Devminjeong-eum')
		.setDescription('데브말ㅆㆍ미 | 개발 용어 발음 사전')
		.setVersion('1.0.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-docs', app, document);
};
