import { Mock } from 'ts-mockery'
import type { StudyWithRelationships } from './transformers'
import { transformStudies } from './transformers'

describe('transformStudies', () => {
  it('transforms studies correctly', () => {
    // Mock data
    const studies = [
      Mock.of<StudyWithRelationships>({
        id: 1,
        name: 'Study 1',
        organisations: [
          {
            organisation: {
              name: 'Org 1',
            },
            organisationRole: {
              name: 'Role 1',
              rtsIdentifier: 'RoleIdentifier1',
            },
          },
        ],
        evaluationCategories: [
          {
            indicatorType: 'Milestone missed',
            updatedAt: new Date('2001-01-01'),
            createdAt: new Date('2001-01-01'),
          },
        ],
        assessments: [{ status: { name: 'On Track' } }],
      }),
    ]

    const expectedResult = [
      {
        id: 1,
        name: 'Study 1',
        organisations: [
          {
            name: 'Org 1',
            roleName: 'Role 1',
            roleIdentifier: 'RoleIdentifier1',
          },
        ],
        assessments: [
          {
            status: {
              name: 'On Track',
            },
            createdAt: '29 September 2023',
            updatedAt: '29 September 2023',
          },
        ],
        evaluationCategories: [
          {
            indicatorType: 'Milestone missed',
          },
        ],
      },
    ]

    const result = transformStudies(studies)
    expect(result).toEqual(expectedResult)
  })
})
