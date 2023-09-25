import { PrismaClient } from 'database'
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'

import { prismaClient } from '../lib/prisma'

jest.mock('../lib/prisma', () => ({
  prismaClient: mockDeep<PrismaClient>(),
}))

beforeEach(() => mockReset(prismaMock))

export const prismaMock = prismaClient as DeepMockProxy<PrismaClient>
