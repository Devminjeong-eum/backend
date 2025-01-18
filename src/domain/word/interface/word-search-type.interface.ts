export const WORD_DETAIL_SEARCH_TYPE = {
	ID: 'id',
	NAME: 'name',
} as const;

export type WordDetailSearchOption = keyof typeof WORD_DETAIL_SEARCH_TYPE;

export const WORD_DETAIL_SEARCH_OPTION = Object.keys(
	WORD_DETAIL_SEARCH_TYPE,
) as WordDetailSearchOption[];
