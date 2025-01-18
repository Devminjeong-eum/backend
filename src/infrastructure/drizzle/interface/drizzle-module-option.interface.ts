import type { DrizzleConfig } from 'drizzle-orm';
import type { PoolOptions } from 'pg';

export interface DrizzleModuleForRootOption {
	pool: Omit<PoolOptions, 'user' | 'host' | 'database' | 'password' | 'port'>;
	drizzle: Omit<DrizzleConfig, 'client'>;
}
