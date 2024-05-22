import { WinstonModule, utilities } from 'nest-winston';
import { format, transports } from 'winston';

const isProduction = process.env.NODE_ENV === 'production';
const { combine, timestamp, simple, ms } = format;

export const winstonLogger = WinstonModule.createLogger({
	transports: [
		new transports.Console({
			level: isProduction ? 'info' : 'debug',
			format: isProduction
				? simple()
				: combine(
						timestamp({ format: 'isoDateTime' }),
						ms(),
						utilities.format.nestLike('dev-malssami', {
							colors: true,
							prettyPrint: true,
						}),
					),
		}),
	],
});
