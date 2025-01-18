import { Module } from '@nestjs/common';

import { AuthModule } from '#/domain/auth/auth.module';
import { UserModule } from '#/domain/user/user.module';
import { SpreadSheetModule } from '#/infrastructure/spread-sheet/spread-sheet.module';

import { ResearchController } from './research.controller';
import { ResearchService } from './service/research.service';

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
