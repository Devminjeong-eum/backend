import { NestFactory } from '@nestjs/core';

import { setupSwaggerModule } from '#/configs/swagger.config';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	setupSwaggerModule(app);

	await app.listen(8080);
}
bootstrap();
