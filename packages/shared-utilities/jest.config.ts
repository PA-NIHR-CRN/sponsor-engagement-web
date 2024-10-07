import type { Config } from 'jest'

const config: Config = {
  setupFiles: ['<rootDir>/jest.env.js'],
  setupFilesAfterEnv: ['<rootDir>/src/mocks/prisma.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}

module.exports = config
