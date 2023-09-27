import type { PrismaClient } from 'database'
import type { DeepMockProxy } from 'jest-mock-extended'
import { mockDeep, mockReset } from 'jest-mock-extended'
import { prismaClient } from '../lib/prisma'

jest.mock('../lib/prisma', () => ({
  prismaClient: mockDeep<PrismaClient>(),
}))

beforeEach(() => mockReset(prismaMock))

export const prismaMock = prismaClient as DeepMockProxy<PrismaClient>
