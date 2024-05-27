import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { postAsync } from '#/common/apis';

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

	public sendDiscordMessage(payload: Embed) {
		return postAsync(this.discordWebhookUrl, payload);
	}

	public async createEmbedErrorMessage() {}
}
