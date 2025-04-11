import { LeadAdministrationId } from '@/@types/studies'

export const getEditAdmin = (LeadAdmin?: LeadAdministrationId) => {
  const adminMap: Record<LeadAdministrationId, string> = {
    [LeadAdministrationId.Scotland]: 'Scotland Admin',
    [LeadAdministrationId.NorthernIreland]: 'NI Portfolio Admin',
    [LeadAdministrationId.Wales]: 'Health and Care Research Wales Admin',
    [LeadAdministrationId.England]: 'RDN',
  }
  return adminMap[LeadAdmin as LeadAdministrationId]
}
