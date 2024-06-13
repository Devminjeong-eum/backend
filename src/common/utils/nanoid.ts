import { customAlphabet } from 'nanoid';

const LETTERS_MAP = {
	UPPERCASE: [...Array(26).keys()].map((i) => String.fromCharCode(i + 65)),
	LOWERCASE: [...Array(26).keys()].map((i) => String.fromCharCode(i + 65)),
	NUMBER: [...Array(10).keys()].map((i) => String(i)),
} as const;

type GenerateNanoIdProps = {
	allowedOption: (keyof typeof LETTERS_MAP)[];
	length: number;
};

const DEFAULT_NANOID_SIZE = 10;

export const generateNanoId = ({
	allowedOption = ['UPPERCASE', 'NUMBER'],
	length = DEFAULT_NANOID_SIZE,
}: GenerateNanoIdProps) => {
	const letterList = allowedOption
		.reduce<
			(string | number)[]
		>((acc, current) => [...acc, ...LETTERS_MAP[current]], [])
		.join('');
	return customAlphabet(letterList)(length);
};
