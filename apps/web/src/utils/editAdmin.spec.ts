import { LeadAdministrationId } from '@/@types/studies'

import { getEditAdmin } from './editAdmin'

describe('getEditAdmin', () => {
  it('returns correct admin label for England Admin', () => {
    expect(getEditAdmin(LeadAdministrationId.England)).toBe('RDN')
  })
  it('returns correct admin label for Northern Ireland Admin', () => {
    expect(getEditAdmin(LeadAdministrationId.NorthernIreland)).toBe('NI Portfolio Admin')
  })
  it('returns correct admin label for Scotland Admin', () => {
    expect(getEditAdmin(LeadAdministrationId.Scotland)).toBe('Scotland Admin')
  })
  it('returns correct admin label for Wales Admin', () => {
    expect(getEditAdmin(LeadAdministrationId.Wales)).toBe('Health and Care Research Wales Admin')
  })
  it('returns undefined for null input', () => {
    expect(getEditAdmin(null)).toBeUndefined()
  })
})
