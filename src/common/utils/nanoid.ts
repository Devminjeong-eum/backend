import { customAlphabet } from 'nanoid';

const alphabetWithNumbers = [
	...[...Array(26).keys()].map((i) => String.fromCharCode(i + 65)), // A - Z
	...[...Array(10).keys()].map((i) => String(i)), // 0 - 9
].join('');

const DEFAULT_NANOID_SIZE = 10;

export const generateNanoId = customAlphabet(
	alphabetWithNumbers,
	DEFAULT_NANOID_SIZE,
);
