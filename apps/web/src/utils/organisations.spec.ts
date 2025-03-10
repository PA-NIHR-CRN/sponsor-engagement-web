import { Roles } from '@/constants'

import { hasOrganisationAccess } from './organisations'

describe('hasOrganisationAccess()', () => {
  const mockOrganisationId = 343

  it('if user is a Sponsor Contact and a Contact Manager, return true', () => {
    expect(
      hasOrganisationAccess([Roles.SponsorContact, Roles.ContactManager], [{ organisationId: 232 }], mockOrganisationId)
    ).toEqual(true)
  })

  it('if user is only a Contact Manager, return true', () => {
    expect(hasOrganisationAccess([Roles.ContactManager], [], mockOrganisationId)).toEqual(true)
  })

  it('if user is a Sponsor Contact and not associated with the given organisation, return false', () => {
    expect(hasOrganisationAccess([Roles.SponsorContact], [{ organisationId: 232 }], mockOrganisationId)).toBe(false)
  })

  it('if user is a Sponsor Contact and is associated with the given organisation, return true', () => {
    expect(
      hasOrganisationAccess([Roles.SponsorContact], [{ organisationId: mockOrganisationId }], mockOrganisationId)
    ).toBe(true)
  })

  it('if user is not a Sponsor Contact or a Contact Manager, return false', () => {
    expect(hasOrganisationAccess([3], [], mockOrganisationId)).toBe(false)
  })
})
