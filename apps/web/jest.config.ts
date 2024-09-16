import './src/config/jest/jest.env'

import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const customJestConfig: Config = {
  verbose: true,
  setupFiles: ['<rootDir>/src/config/jest/jest.env.js'],
  setupFilesAfterEnv: ['<rootDir>/src/config/jest/jest.setup.js', '<rootDir>/src/__mocks__/prisma.ts'],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  reporters: ['default', 'jest-junit'],
  testPathIgnorePatterns: ['.vscode'],
  coverageReporters: ['json-summary', 'text', 'html', 'lcov'],
  coveragePathIgnorePatterns: ['node_modules', 'src/utils/schemas/env.schema.js', 'src/@types'],
  coverageThreshold: {
    global: {
      lines: 89,
      functions: 87,
      branches: 80,
      statements: 88,
    },
  },
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!qa/**'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = async () => ({
  ...(await createJestConfig(customJestConfig)()),
  transformIgnorePatterns: [],
})
