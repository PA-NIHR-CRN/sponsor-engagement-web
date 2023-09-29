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
      },
    ]

    const result = transformStudies(studies)
    expect(result).toEqual(expectedResult)
  })
})
