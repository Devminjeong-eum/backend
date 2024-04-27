import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwaggerModule(app: INestApplication): void {
	const config = new DocumentBuilder()
		.setTitle('Devminjeong-eum')
		.setDescription('데브말ㅆㆍ미 | 개발 용어 발음 사전')
		.setVersion('1.0.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-docs', app, document);
}
