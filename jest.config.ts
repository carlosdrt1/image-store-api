import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!@faker-js/faker)'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    '\\.module\\.ts$',
    '\\.dto\\.ts$',
    '\\.interface\\.ts$',
    '\\.abstract\\.ts$',
    './src/main.ts',
  ],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^test/(.*)$': '<rootDir>/test/$1',
  },
};

export default config;
