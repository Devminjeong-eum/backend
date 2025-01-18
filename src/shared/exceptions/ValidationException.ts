import { BadRequestException } from '@nestjs/common';

import type { ValidationError } from 'class-validator';

export class ValidationException extends BadRequestException {
	constructor(public validationErrors: ValidationError[]) {
		super('Validation failed');
	}
}
