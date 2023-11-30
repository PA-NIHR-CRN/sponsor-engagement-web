import type { Config } from 'jest'

const config: Config = {
  setupFiles: ['<rootDir>/jest.env.js'],
  setupFilesAfterEnv: ['<rootDir>/src/mocks/prisma.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testPathIgnorePatterns: ['dist', '.vscode'],
  coverageReporters: ['json-summary', 'text', 'html', 'lcov'],
  coveragePathIgnorePatterns: ['node_modules', './index.ts'],
  coverageThreshold: {
    global: {
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
    },
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
}

module.exports = config
