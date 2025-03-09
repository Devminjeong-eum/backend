import { Module } from '@nestjs/common';

import { RedisModule } from '#/infrastructure/redis/redis.module';

import { WordViewerIdInterceptor } from './interceptor/word-viewer-id';
import { WordViewService } from './service/word-view.service';

@Module({
	imports: [RedisModule],
	providers: [WordViewService, WordViewerIdInterceptor],
	exports: [WordViewService, WordViewerIdInterceptor],
})
export class WordViewModule {}
