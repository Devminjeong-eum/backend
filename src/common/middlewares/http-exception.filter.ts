import {
	type ArgumentsHost,
	type ExceptionFilter,
	HttpException,
	Logger,
} from '@nestjs/common';

import { ValidationError } from 'class-validator';
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
			message: exception.message,
		};

		switch (true) {
			case exception instanceof ValidationError: {
				statusCode = 400;
				Logger.error(
					'Validation Error',
					JSON.stringify({ ...errorResponse, statusCode }),
					exception.stack,
				);
				break;
			}
			case exception instanceof HttpException: {
				statusCode = exception.getStatus();
				Logger.error(
					'HTTP Error',
					JSON.stringify({ ...errorResponse, statusCode }),
					exception.stack,
				);
				break;
			}
			default: {
				Logger.warn('Server Error', JSON.stringify(errorResponse));
			}
		}

		return response.status(statusCode).json(errorResponse);
	}
}
