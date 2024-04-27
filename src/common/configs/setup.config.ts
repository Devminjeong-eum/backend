import { ConfigModule } from '@nestjs/config';

export const GlobalConfigModule = ConfigModule.forRoot({
	isGlobal: true,
	envFilePath: `.env.${process.env.NODE_ENV}`,
});
