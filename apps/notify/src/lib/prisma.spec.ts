import type * as prisma from './prisma'

describe('prisma client', () => {
  it('should be defined', () => {
    const { prismaClient } = jest.requireActual<typeof prisma>('./prisma')
    expect(prismaClient).toBeDefined()
    expect(prismaClient.study).toBeDefined()
  })
})
