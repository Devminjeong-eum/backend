import { HttpStatus } from '@nestjs/common';

export interface ApiErrorResponse {
	timestamp: string;
	statusCode: HttpStatus;
	path: string;
	method: string;
	message: string;
}
