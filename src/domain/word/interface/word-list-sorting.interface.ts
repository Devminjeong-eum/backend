import { asc, desc, sql } from 'drizzle-orm';

import * as schema from '#/infrastructure/drizzle/schema';

export const WORD_SORTING_TYPE = {
	CREATED: [schema.word.createdAt, asc],
	LIKED: [sql`likeCount`, desc],
	ALPHABET: [schema.word.name, asc],
} as const;

export type SortingWordListOption = keyof typeof WORD_SORTING_TYPE;
export const SORTING_WORD_OPTION = Object.keys(
	WORD_SORTING_TYPE,
) as SortingWordListOption[];
