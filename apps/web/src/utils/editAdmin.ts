import { LeadAdministrationId } from 'shared-utilities/src/utils/lead-administration-id'

export function getEditAdmin(leadAdmin: LeadAdministrationId | null): string {
  const adminMap: Record<LeadAdministrationId, string> = {
    [LeadAdministrationId.Scotland]: 'Scotland Admin',
    [LeadAdministrationId.NorthernIreland]: 'NI Portfolio Admin',
    [LeadAdministrationId.Wales]: 'Health and Care Research Wales Admin',
    [LeadAdministrationId.England]: 'RDN',
  }
  if (leadAdmin === null) {
    return ''
  }
  return adminMap[leadAdmin]
}
