import { Injectable } from '@nestjs/common';

import { WordViewRepository } from '#/infrastructure/drizzle/repository/word-view.repository';
import { InjectRedisClient } from '#/infrastructure/redis/decorator/inject-redis-client.decorator';
import { RedisClient } from '#/infrastructure/redis/interface/redis-client.interface';
import dayjs from '#/shared/utils/dayjs';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class WordViewService {
	constructor(
		@InjectRedisClient() private readonly redisClient: RedisClient,
		private readonly wordViewRepository: WordViewRepository,
	) {}

	private WORD_VIEW_LOG_KEY = 'word-view-log';
	private DUPLICATE_CHECK_THRESHOLD = 60 * 5;

	private async isRecentLogExists({
		userId,
		wordId,
	}: {
		userId: string;
		wordId: string;
	}) {
		const currentTimestamp = Math.floor(Date.now() / 1000);
		const currentWordViewLogList = await this.redisClient.zRange(
			`${this.WORD_VIEW_LOG_KEY}:${wordId}`,
			currentTimestamp - this.DUPLICATE_CHECK_THRESHOLD,
			currentTimestamp,
			{ BY: 'SCORE' },
		);

		const isDuplicated = currentWordViewLogList.some((wordViewLog) =>
			wordViewLog.includes(userId),
		);
		return isDuplicated;
	}

	private async getCurrentViewedWordIdList() {
		let cursor: number = 0;
		const wordIdList: string[] = [];

		do {
			const { cursor: nextCursor, keys } = await this.redisClient.scan(
				cursor,
				{ MATCH: 'word-view-log:*' },
			);
			const currentWordIdList = keys.map(
				(key) => key.split(':')[1] as string,
			);

			cursor = Number(nextCursor);
			wordIdList.push(...currentWordIdList);
		} while (cursor !== 0);

		return wordIdList;
	}

	async insertWordViewLog({
		userId,
		wordId,
	}: {
		userId: string;
		wordId: string;
	}) {
		const isRecentLogExists = await this.isRecentLogExists({
			userId,
			wordId,
		});
		if (isRecentLogExists) return;

		const currentTimestamp = Math.floor(Date.now() / 1000);
		await this.redisClient.zAdd(`${this.WORD_VIEW_LOG_KEY}:${wordId}`, {
			score: currentTimestamp,
			value: `${userId}:${currentTimestamp}`,
		});
	}

	private async countAndPurgeOldViewLogs({ wordId }: { wordId: string }) {
		const LOG_PRESERVE_THRESHOLD =
			Math.floor(Date.now() / 1000) - this.DUPLICATE_CHECK_THRESHOLD;

		const viewLogAmount = await this.redisClient.zCount(
			`${this.WORD_VIEW_LOG_KEY}:${wordId}`,
			'-inf',
			LOG_PRESERVE_THRESHOLD,
		);

		if (!viewLogAmount) return;

		await this.redisClient.zRemRangeByScore(
			`${this.WORD_VIEW_LOG_KEY}:${wordId}`,
			'-inf',
			LOG_PRESERVE_THRESHOLD,
		);

		await this.wordViewRepository.insertWordViewLog({
			wordId,
			viewCount: viewLogAmount,
			viewedAt: dayjs().startOf('hours').toDate(),
		});
	}

    @Cron(CronExpression.EVERY_3_HOURS)
	async processBatchUpdateWordView() {
		const wordIdList = await this.getCurrentViewedWordIdList();

		if (!wordIdList.length) return;

		await Promise.all(
			wordIdList.map((wordId) =>
				this.countAndPurgeOldViewLogs({ wordId }),
			),
		);
	}
}
