export const WORD_SORTING_TYPE = {
	CREATED: ['word.createdAt', 'ASC'],
	LIKED: ['likeCount', 'DESC'],
	ALPHABET: ['word.name', 'ASC'],
} as const;

export type SortingWordListOption = keyof typeof WORD_SORTING_TYPE;
export const SORTING_WORD_OPTION = Object.keys(
	WORD_SORTING_TYPE,
) as SortingWordListOption[];
