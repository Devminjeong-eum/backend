import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from '@nestjs/common';

import type { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const { statusCode } = context.switchToHttp().getResponse<Response>();
		return next
			.handle()
			.pipe(map((value) => ({ status: statusCode, data: value })));
	}
}
