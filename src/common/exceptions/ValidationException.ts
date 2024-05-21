import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends BadRequestException {
  constructor(public validationErrors: ValidationError[]) {
    super('Validation failed');
  }
}