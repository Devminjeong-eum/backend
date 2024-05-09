import {
	Inject,
	Injectable,
	Logger,
	LoggerService,
	NestMiddleware,
} from '@nestjs/common';

import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(@Inject(Logger) private readonly logger: LoggerService) {}

	use(request: Request, response: Response, next: NextFunction) {
		const { method, url, query, body } = request;
		const { statusCode } = response;

		this.logger.log({
			statusCode,
			method,
			url,
			query,
			body,
		});

		next();
	}
}
