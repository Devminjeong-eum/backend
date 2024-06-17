import { Module } from '@nestjs/common';

import { AuthModule } from '#/auth/auth.module';
import { SpreadSheetModule } from '#/spread-sheet/spread-sheet.module';
import { UserModule } from '#/user/user.module';

import { ResearchService } from './research.service';

@Module({
	imports: [
		SpreadSheetModule,
		AuthModule,
		UserModule,
	],
	providers: [
		// Service
		ResearchService,
	],
	exports: [ResearchService],
})
export class ResearchModule {}
