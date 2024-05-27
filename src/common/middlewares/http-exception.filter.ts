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
		return stack
			? stack
					.split('\n')
					.slice(1, lines + 1)
					.map((line) => line.trimStart())
			: '';
	}

	catch(exception: Error, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		let statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		let error: unknown = exception;
		let errorResponse: Record<string, unknown> = {
			timestamp: new Date().toISOString(),
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
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
				(error = errorDetails),
					(errorResponse = {
						...errorResponse,
						statusCode,
						message: exception.message,
					});
				break;
			}
			case exception instanceof HttpException: {
				const responseBody = exception.getResponse() as Record<
					string,
					unknown
				>;

				statusCode = exception.getStatus();
				(error = responseBody.error),
					(errorResponse = {
						...errorResponse,
						statusCode,
						message: responseBody.message,
					});
				break;
			}
			default: {
				statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
				errorResponse = {
					...errorResponse,
					statusCode,
					message: exception.message,
				};
			}
		}

		Logger.error({
			...errorResponse,
			error,
			stack: this.getPartialStackTrace(exception.stack),
		});

		return response.status(statusCode).json(errorResponse);
	}
}
