import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import type * as schema from '#/infrastructure/drizzle/schema';

export type DrizzlePgClient = NodePgDatabase<typeof schema>;
