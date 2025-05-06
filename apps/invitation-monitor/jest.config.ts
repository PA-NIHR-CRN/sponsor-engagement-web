import type { Config } from 'jest'

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/src/config/jest.setup.js', '<rootDir>/src/mocks/prisma.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testPathIgnorePatterns: ['dist', '.vscode'],
  coverageReporters: ['json-summary', 'text', 'html', 'lcov'],
  coveragePathIgnorePatterns: ['node_modules', './index.ts'],
  coverageThreshold: {
    global: {
      lines: 96,
      functions: 100,
      branches: 80,
      statements: 97,
    },
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
}

module.exports = config
