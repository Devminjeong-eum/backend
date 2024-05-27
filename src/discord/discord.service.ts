import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { postAsync } from '#/common/apis';
import { ApiErrorResponse } from '#/common/interfaces/api-error-response.interface';

import Embed from './interface/embed-message.interface';

@Injectable()
export class DiscordWebhookService {
	private readonly discordWebhookUrl: string;

	constructor(private readonly configService: ConfigService) {
		const discordWebHookUrl = this.configService.get<string>(
			'DISCORD_WEBHOOK_URL',
		);

		if (!discordWebHookUrl)
			throw new InternalServerErrorException(
				'DISCORD_WEBHOOK_URL 환경 변수가 존재하지 않습니다.',
			);

		this.discordWebhookUrl = discordWebHookUrl;
	}

	public sendExceptionMessage(
		exception: ApiErrorResponse,
		errorStack: string[] | string,
	) {
		const embedMessage = this.createEmbedErrorMessage(
			exception,
			errorStack,
		);
		return this.sendDiscordMessage(embedMessage);
	}

	private async sendDiscordMessage(payload: Embed) {
		return postAsync(this.discordWebhookUrl, payload);
	}

	private createEmbedErrorMessage(
		errorResponse: ApiErrorResponse,
		errorStack: string[] | string,
	): Embed {
		const { timestamp, statusCode, path, method, message } = errorResponse;
		const errorStackMessage = Array.isArray(errorStack)
			? errorStack.join('\n')
			: errorStack;

		const embedMessage: Embed = {
			title: `데브말ㅆㆍ미 서버에서 ${statusCode} 에러가 발생했습니다.`,
			description: message,
			fields: [
				{
					name: '⏰ 에러 발생 시각',
					value: timestamp,
				},
				{
					name: '🔗 URL / HTTP Method',
					value: `${method.toUpperCase()} ${path}`,
				},
				{
					name: '📂 Error Stack',
					value: errorStackMessage,
				},
			],
		};

		return embedMessage;
	}
}
