import {
	HttpStatus,
	Inject,
	Injectable,
	LoggerService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import dayjs from 'dayjs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { postAsync } from '#/shared/apis';
import type { ApiErrorResponse } from '#/shared/interfaces/api-error-response.interface';

import type Embed from '../interface/embed-message.interface';

@Injectable()
export class DiscordWebhookService {
	private readonly discordWebhookUrl: string;
	private readonly isDev: boolean;

	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER)
		private readonly logger: LoggerService,
		private readonly configService: ConfigService,
	) {
		const discordWebHookUrl = this.configService.getOrThrow<string>(
			'DISCORD_WEBHOOK_URL',
		);
		const isDev =
			this.configService.get<string>('NODE_ENV') === 'development';

		this.discordWebhookUrl = discordWebHookUrl;
		this.isDev = isDev;
	}

	public sendExceptionMessage(
		exception: ApiErrorResponse,
		errorStack: string[] | string,
	) {
		if (this.isDev) return;
		const embedMessage = this.createEmbedErrorMessage(
			exception,
			errorStack,
		);
		return this.sendDiscordMessage(embedMessage);
	}

	private async sendDiscordMessage(embedMessage: Embed[]) {
		try {
			return postAsync(
				this.discordWebhookUrl,
				{ embeds: embedMessage },
				{},
			);
		} catch (error) {
			this.logger.error({
				timestamp: new Date().toISOString(),
				statusCode: HttpStatus.TOO_MANY_REQUESTS,
				message: 'Discord Webhook Limit Exceed',
			});
		}
	}

	private createEmbedErrorMessage(
		errorResponse: ApiErrorResponse,
		errorStack: string[] | string,
	) {
		const { timestamp, statusCode, path, method, message } = errorResponse;
		const errorOccurredTime = dayjs(timestamp).format(
			'YYYY년 MM월 DD일 HH시 mm분 ss초',
		);
		const errorStackMessage = Array.isArray(errorStack)
			? errorStack.join('\n')
			: errorStack;

		const embedMessage: Embed[] = [
			{
				title: `데브말ㅆㆍ미 서버에서 ${statusCode} 에러가 발생했습니다.`,
				description: message,
				color: 15548997, // NOTE: RED
				fields: [
					{
						name: '⏰ 에러 발생 시각',
						value: errorOccurredTime,
					},
					{
						name: '🔗 URL / HTTP Method',
						value: `${method.toUpperCase()} ${path}`,
					},
					{
						name: '📂 Error Stack',
						value: `\`\`\`${errorStackMessage}\`\`\``,
						inline: true,
					},
				],
			},
		];

		return embedMessage;
	}
}
