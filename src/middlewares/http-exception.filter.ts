import {
	type ArgumentsHost,
	type ExceptionFilter,
	HttpException,
	INestApplication,
	Logger,
} from '@nestjs/common';

import type { Request, Response } from 'express';

export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: Error, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		let statusCode = 500;

		const errorResponse = {
			statusCode,
			timestamp: new Date().toISOString(),
			path: request.url,
			method: request.method,
		};

		switch (true) {
			case exception instanceof HttpException: {
				statusCode = exception.getStatus();
				Logger.error(
					'SERVER Error',
					JSON.stringify({ ...errorResponse, statusCode }),
					exception.stack,
				);
			}
			default: {
				Logger.warn('HTTP Error', JSON.stringify(errorResponse));
			}
		}

		return response.status(statusCode).json(errorResponse);
	}
}

export const setupExceptionFilter = (app: INestApplication) => {
	app.useGlobalFilters(new HttpExceptionFilter());
};
