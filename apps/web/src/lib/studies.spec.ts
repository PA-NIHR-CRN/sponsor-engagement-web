import { Mock } from 'ts-mockery'
import type { Study } from 'database'
import { prismaMock } from '../__mocks__/prisma'
import { StudySponsorOrganisationRoleRTSIdentifier } from '../constants'
import { getStudyById, getStudiesForOrgs } from './studies'

describe('getStudiesForOrgs', () => {
  const mockStudies = [Mock.of<Study>({ id: 1, name: 'Study 1' }), Mock.of<Study>({ id: 2, name: 'Study 2' })]
  const mockStudyCount = 2
  const mockStudyDueAssessmentCount = 1

  it('should return studies and pagination information', async () => {
    prismaMock.$transaction.mockResolvedValueOnce([mockStudies, mockStudyCount, mockStudyDueAssessmentCount])

    const userOrganisationIds = [1, 2]

    const result = await getStudiesForOrgs({
      organisationIds: userOrganisationIds,
      pageSize: 10,
      currentPage: 1,
      searchTerm: null,
    })

    expect(result).toEqual({
      pagination: {
        total: mockStudyCount,
        totalDue: mockStudyDueAssessmentCount,
      },
      data: mockStudies,
    })

    expect(prismaMock.study.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 10,
        where: {
          organisations: {
            some: {
              organisationId: { in: userOrganisationIds },
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

  it('should query studies by study title, irasId and protocolReferenceNumber when a search term is provided', async () => {
    prismaMock.$transaction.mockResolvedValueOnce([mockStudies, mockStudyCount, mockStudyDueAssessmentCount])

    const userOrganisationIds = [1, 2]
    const searchTerm = 'test-study'

    const result = await getStudiesForOrgs({
      organisationIds: userOrganisationIds,
      pageSize: 10,
      currentPage: 1,
      searchTerm,
    })

    expect(result).toEqual({
      pagination: {
        total: mockStudyCount,
        totalDue: mockStudyDueAssessmentCount,
      },
      data: mockStudies,
    })

    expect(prismaMock.study.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 10,
        where: {
          OR: [
            { name: { contains: 'test-study' } },
            { irasId: { contains: 'test-study' } },
            { protocolReferenceNumber: { contains: 'test-study' } },
          ],
          organisations: {
            some: {
              organisationId: { in: userOrganisationIds },
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
        OR: [
          { name: { contains: 'test-study' } },
          { irasId: { contains: 'test-study' } },
          { protocolReferenceNumber: { contains: 'test-study' } },
        ],
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

describe('getStudyById', () => {
  it('should return a study with the given id', async () => {
    prismaMock.study.findFirst.mockResolvedValueOnce(Mock.of<Study>({ id: 1, name: 'Study 1' }))

    const userOrganisationIds = [1, 2]

    const study = await getStudyById(1, userOrganisationIds)

    expect(prismaMock.study.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 1,
          organisations: {
            some: {
              organisationId: { in: userOrganisationIds },
            },
          },
        },
      })
    )

    expect(study?.id).toEqual(1)
    expect(study?.name).toEqual('Study 1')
  })
})
