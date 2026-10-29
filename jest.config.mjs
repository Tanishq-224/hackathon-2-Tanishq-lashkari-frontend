/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpe?g|gif|webp|svg)$': '<rootDir>/src/tests/fileMock.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.jest.json',
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/main.tsx'],
}
