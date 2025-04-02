export enum StudySponsorOrganisationRoleRTSIdentifier {
  ContractResearchOrganisation = 'CRO@2.16.840.1.113883.2.1.3.8.5.11.1.107',
  ClinicalResearchSponsor = 'CRSPNSR@2.16.840.1.113883.5.110',
  ClinicalTrialsUnit = 'MNG_CTU@2.16.840.1.113883.2.1.3.8.5.11.1.107',
}

/**
 * The type of a study update - Direct/Proposed
 * This should match the values in SysRefStudyUpdateType table
 */
export enum StudyUpdateType {
  Direct = 1,
  Proposed = 2,
}

/**
 * The state of a study update - Before/After
 * This should match the values in SysRefStudyUpdateState table
 */
export enum StudyUpdateState {
  Before = 1,
  After = 2,
}

/**
 * The status of an invitation email
 * This should match the values in SysRefInvitationStatus table
 */
export const UserOrganisationInviteStatus = { SUCCESS: 'Success', FAILURE: 'Failure', PENDING: 'Pending' }
