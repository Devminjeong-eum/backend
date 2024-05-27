import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DiscordWebhookService } from './discord.service';

@Module({
	imports: [ConfigModule],
	providers: [DiscordWebhookService],
	exports: [DiscordWebhookService],
})
export class DiscordWebhookModule {}
