import { Mock } from 'ts-mockery'
import type { Study, UserOrganisation } from 'database'
import { prismaMock } from '../__mocks__/prisma'
import { StudySponsorOrganisationRoleRTSIdentifier } from '../constants'
import { getUserStudies } from './studies'

describe('getUserStudies', () => {
  const mockUserOrganisations = [
    Mock.of<UserOrganisation>({ organisationId: 1 }),
    Mock.of<UserOrganisation>({ organisationId: 2 }),
  ]
  const mockStudies = [Mock.of<Study>({ id: 1, name: 'Study 1' }), Mock.of<Study>({ id: 2, name: 'Study 2' })]
  const mockStudyCount = 2
  const mockStudyDueAssessmentCount = 1

  it('should return studies and pagination information', async () => {
    prismaMock.userOrganisation.findMany.mockResolvedValueOnce(mockUserOrganisations)

    prismaMock.study.findMany.mockResolvedValueOnce(mockStudies)
    prismaMock.study.count.mockResolvedValueOnce(mockStudyCount)
    prismaMock.study.count.mockResolvedValueOnce(mockStudyDueAssessmentCount)

    prismaMock.$transaction.mockResolvedValueOnce([mockStudies, mockStudyCount, mockStudyDueAssessmentCount])

    const result = await getUserStudies(1, 1, 10)

    expect(result).toEqual({
      pagination: {
        total: mockStudyCount,
        totalDue: mockStudyDueAssessmentCount,
      },
      data: mockStudies,
    })

    expect(prismaMock.userOrganisation.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
    })

    expect(prismaMock.study.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 10,
        where: {
          organisations: {
            some: {
              organisationId: { in: [1, 2] },
              organisationRole: {
                rtsIdentifier: {
                  in: [
                    StudySponsorOrganisationRoleRTSIdentifier.ClinicalResearchSponsor,
                    StudySponsorOrganisationRoleRTSIdentifier.ClinicalTrialsUnit,
                    StudySponsorOrganisationRoleRTSIdentifier.ContractResearchOrganisation,
                  ],
                },
              },
            },
          },
        },
      })
    )

    expect(prismaMock.study.count).toHaveBeenCalledWith({
      where: {
        organisations: {
          some: {
            organisationId: { in: [1, 2] },
            organisationRole: {
              rtsIdentifier: {
                in: [
                  StudySponsorOrganisationRoleRTSIdentifier.ClinicalResearchSponsor,
                  StudySponsorOrganisationRoleRTSIdentifier.ClinicalTrialsUnit,
                  StudySponsorOrganisationRoleRTSIdentifier.ContractResearchOrganisation,
                ],
              },
            },
          },
        },
      },
    })
  })
})
