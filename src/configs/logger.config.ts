import { WinstonModule, utilities } from 'nest-winston';
import {format, transports } from 'winston';

const isProduction = process.env.NODE_ENV === 'production';
const { combine, timestamp, simple } = format;

export const winstonLogger = WinstonModule.createLogger({
	transports: [
		new transports.Console({
			level: isProduction ? 'http' : 'debug',
			format: isProduction
				? simple()
				: combine(
						timestamp({ format: 'isoDateTime' }),
						utilities.format.nestLike('dev-minjeong-eom', {
							colors: true,
							prettyPrint: true,
						}),
					),
		}),
	],
});
