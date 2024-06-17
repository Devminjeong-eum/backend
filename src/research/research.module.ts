import { Module } from '@nestjs/common';

import { AuthModule } from '#/auth/auth.module';
import { SpreadSheetModule } from '#/spread-sheet/spread-sheet.module';
import { UserModule } from '#/user/user.module';

import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';

@Module({
	imports: [SpreadSheetModule, AuthModule, UserModule],
	controllers: [ResearchController],
	providers: [
		// Service
		ResearchService,
	],
	exports: [ResearchService],
})
export class ResearchModule {}
