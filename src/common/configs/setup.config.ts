import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

export const GlobalConfigModule = ConfigModule.forRoot({
	isGlobal: true,
	envFilePath: `.env.${process.env.NODE_ENV}`,
});

export const GlobalScheduleModule = ScheduleModule.forRoot();
