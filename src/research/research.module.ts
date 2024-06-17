import { Module } from '@nestjs/common';

import { AuthModule } from '#/auth/auth.module';
import { SpreadSheetModule } from '#/spread-sheet/spread-sheet.module';
import { UserModule } from '#/user/user.module';

import { ResearchService } from './research.service';
import { ResearchController } from './research.controller';

@Module({
	imports: [
		SpreadSheetModule,
		AuthModule,
		UserModule,
	],
	controllers: [ResearchController],
	providers: [
		// Service
		ResearchService,
	],
	exports: [ResearchService],
})
export class ResearchModule {}
