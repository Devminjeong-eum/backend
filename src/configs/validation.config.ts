import { type INestApplication, ValidationPipe } from '@nestjs/common';

export const setupValidationPipe = (app: INestApplication) => {
	app.useGlobalPipes(new ValidationPipe());
};
