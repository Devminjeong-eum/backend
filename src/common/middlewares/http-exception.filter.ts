import {
	type ArgumentsHost,
	type ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';

import type { Request, Response } from 'express';

import { ValidationException } from '../exceptions/ValidationException';

export class HttpExceptionFilter implements ExceptionFilter {
	private getPartialStackTrace(stack: string | undefined, lines: number = 3) {
		return stack ? stack.split('\n').slice(1, lines + 1).join('\n') : '';
	}

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
			case exception instanceof ValidationException: {
				const errorDetails = exception.validationErrors.map(
					(error) => ({
						property: error.property,
						value: error.value,
						constraints: error.constraints,
					}),
				);

				statusCode = HttpStatus.BAD_REQUEST;

				Logger.error({
					...errorResponse,
					statusCode,
					message: exception.message,
					error: errorDetails,
					stack: this.getPartialStackTrace(exception.stack),
				});
				break;
			}
			case exception instanceof HttpException: {
				statusCode = exception.getStatus();
				const responseBody = exception.getResponse() as Record<
					string,
					any
				>;
				Logger.error({
					...errorResponse,
					statusCode,
					message: responseBody.message,
					error: responseBody.error,
					stack: this.getPartialStackTrace(exception.stack),
				});
				break;
			}
			default: {
				statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

				Logger.error({
					...errorResponse,
					statusCode,
					message: exception.message,
					error: exception,
					stack: this.getPartialStackTrace(exception.stack),
				});
			}
		}

		return response.status(statusCode).json(errorResponse);
	}
}
