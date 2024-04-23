import {
	type ArgumentsHost,
	type ExceptionFilter,
	type HttpException,
	HttpStatus,
	INestApplication,
	Logger,
} from '@nestjs/common';

import type { Request, Response } from 'express';

export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const statusCode = exception.getStatus();

		const errorResponse = {
			statusCode,
			timestamp: new Date().toISOString(),
			path: request.url,
			method: request.method,
		};

        switch (statusCode) {
            case HttpStatus.INTERNAL_SERVER_ERROR: {
                Logger.error('SERVER Error', JSON.stringify(errorResponse), exception.stack)
            };
            default: {
                Logger.warn('HTTP Error', JSON.stringify(errorResponse));
            }
        }
        
		response.status(statusCode).json(errorResponse);
	}
}

export const setupExceptionFilter = (app: INestApplication) => {
    app.useGlobalFilters(new HttpExceptionFilter());
}