import { LoggerService } from '@nestjs/common';

import { utilities } from 'nest-winston';
import * as winston from 'winston';

const { combine, timestamp } = winston.format;

export class WinstonLoggerService implements LoggerService {
	private logger: winston.Logger;

	constructor(service: string) {
		this.logger = winston.createLogger({
			transports: [
				new winston.transports.Console({
					level: 'debug',
					format: combine(
						timestamp({ format: 'isoDateTime' }),
						utilities.format.nestLike(service, {
							prettyPrint: true,
							colors: true,
						}),
					),
				}),
			],
		});
	}

	log(message: string) {
		this.logger.log({ level: 'info', message });
	}

	error(message: string, errorStackTrace: string) {
		this.logger.error(message, errorStackTrace);
	}

	warn(message: string) {
		this.logger.warning(message);
	}

	info(message: string) {
		this.logger.info(message);
	}
}
