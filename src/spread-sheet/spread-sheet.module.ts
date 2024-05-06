import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SpreadConnectService } from './spread-connect.service';
import { SpreadSheetService } from './spread-sheet.service';

@Module({
	imports: [ConfigModule],
	providers: [SpreadSheetService, SpreadConnectService],
	exports: [SpreadSheetService, SpreadConnectService],
})
export class SpreadSheetModule {}
