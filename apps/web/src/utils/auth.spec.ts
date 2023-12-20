import { Roles } from '../constants/auth'
import { isContactManager, isContactManagerAndSponsorContact, isSponsorContact } from './auth'

describe('Authentication utility functions', () => {
  describe('isContactManager', () => {
    test('returns true when roles include only ContactManager', () => {
      const roles = [Roles.ContactManager]
      const result = isContactManager(roles)
      expect(result).toBe(true)
    })

    test('returns false when roles do not include ContactManager', () => {
      const roles = [Roles.SponsorContact]
      const result = isContactManager(roles)
      expect(result).toBe(false)
    })

    test('returns false when roles include multiple roles', () => {
      const roles = [Roles.ContactManager, Roles.SponsorContact]
      const result = isContactManager(roles)
      expect(result).toBe(false)
    })

    test('returns false when roles is an empty array', () => {
      const roles: number[] = []
      const result = isContactManager(roles)
      expect(result).toBe(false)
    })
  })

  describe('isSponsorContact', () => {
    test('returns true when roles include only SponsorContact', () => {
      const roles = [Roles.SponsorContact]
      const result = isSponsorContact(roles)
      expect(result).toBe(true)
    })

    test('returns false when roles do not include SponsorContact', () => {
      const roles = [Roles.ContactManager]
      const result = isSponsorContact(roles)
      expect(result).toBe(false)
    })

    test('returns false when roles include multiple roles', () => {
      const roles = [Roles.SponsorContact, Roles.ContactManager]
      const result = isSponsorContact(roles)
      expect(result).toBe(false)
    })

    test('returns false when roles is an empty array', () => {
      const roles: number[] = []
      const result = isSponsorContact(roles)
      expect(result).toBe(false)
    })
  })

  describe('isContactManagerAndSponsorContact', () => {
    test('returns true when roles include both ContactManager and SponsorContact', () => {
      const roles = [Roles.ContactManager, Roles.SponsorContact]
      const result = isContactManagerAndSponsorContact(roles)
      expect(result).toBe(true)
    })

    test('returns false when roles do not include both ContactManager and SponsorContact', () => {
      const roles = [Roles.ContactManager]
      const result = isContactManagerAndSponsorContact(roles)
      expect(result).toBe(false)
    })

    test('returns false when roles include only one of the roles', () => {
      const roles = [Roles.SponsorContact]
      const result = isContactManagerAndSponsorContact(roles)
      expect(result).toBe(false)
    })

    test('returns false when roles is an empty array', () => {
      const roles: number[] = []
      const result = isContactManagerAndSponsorContact(roles)
      expect(result).toBe(false)
    })
  })
})
