import type { PrismaClient } from 'database'
import type { DeepMockProxy } from 'jest-mock-extended'
import { mockDeep, mockReset } from 'jest-mock-extended'
import { prismaClient } from '../utils/prisma'

jest.mock('../utils/prisma', () => ({
  prismaClient: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = prismaClient as DeepMockProxy<PrismaClient>
