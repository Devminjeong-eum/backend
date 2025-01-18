import type { Config } from 'jest';

const config: Config = {
	moduleFileExtensions: ['js', 'ts'],
	rootDir: 'src',
	testRegex: '.*\\.(spec|test)\\.ts$',
    testEnvironment: 'node',
	transform: {
		'^.+\\.(ts)$': '@swc/jest',
	},
	moduleNameMapper: {
		'#/(.*)$': '<rootDir>/$1',
	},

    coverageProvider: "v8",
    collectCoverage: true,
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../test/coverage',
};

export default config;
