import { Mock } from 'ts-mockery'
import type { UserOrganisation } from 'database'
import { prismaMock } from '../__mocks__/prisma'
import { getUserOrganisations } from './organisations'

describe('getUserOrganisations', () => {
  it('returns organisations for the user', async () => {
    const mockUserOrganisation = Mock.of<UserOrganisation>({ organisationId: 123 })

    prismaMock.userOrganisation.findMany.mockResolvedValueOnce([mockUserOrganisation])

    const userOrgs = await getUserOrganisations(123)

    expect(prismaMock.userOrganisation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 123 },
      })
    )

    expect(userOrgs).toStrictEqual([mockUserOrganisation])
  })
})
