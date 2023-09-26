import type { Config } from 'jest'

const config: Config = {
  setupFiles: ['<rootDir>/jest.env.js'],
  setupFilesAfterEnv: ['<rootDir>/src/mocks/prisma.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testPathIgnorePatterns: ['dist', '.vscode'],
  coverageReporters: ['json-summary', 'text', 'html', 'lcov'],
  coveragePathIgnorePatterns: ['node_modules'],
  coverageThreshold: {
    global: {
      lines: 96,
      functions: 100,
      branches: 87,
      statements: 97,
    },
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
}

module.exports = config
