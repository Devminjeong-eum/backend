import { type INestApplication, ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';

import { ApiResponseInterceptor } from '#middlewares/api-response.interceptor';
import { HttpExceptionFilter } from '#middlewares/http-exception.filter';

export const setupNestApplication = (app: INestApplication) => {
	app.use(cookieParser());
	app.enableCors({ origin: true, credentials: true });
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
		}),
	);
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalInterceptors(new ApiResponseInterceptor());
};
