import type { DynamicModule} from "@nestjs/common";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { DRIZZLE_CLIENT, DRIZZLE_CLIENT_OPTIONS } from "./constant/drizzle.constant";
import type { DrizzleModuleForRootOption } from "./interface/drizzle-module-option.interface";
import { createDrizzleClient } from "./factory/drizzle-client.factory";

@Global()
@Module({})
export class DrizzleModule {
    static forRoot(option?: DrizzleModuleForRootOption): DynamicModule {
        return {
            module: DrizzleModule,
            imports: [ConfigModule],
            providers: [
                {
                    provide: DRIZZLE_CLIENT_OPTIONS,
                    useValue: option,
                },
                {
                    provide: DRIZZLE_CLIENT,
                    inject: [ConfigService, DRIZZLE_CLIENT_OPTIONS],
                    useFactory: createDrizzleClient,
                }
            ],
            exports: [DRIZZLE_CLIENT],
        }
    }
}