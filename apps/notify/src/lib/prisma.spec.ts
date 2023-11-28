describe('prisma client', () => {
  it('should be defined', () => {
    const { prismaClient } = jest.requireActual('./prisma')
    expect(prismaClient).toBeDefined()
    expect(prismaClient.study).toBeDefined()
  })
})
