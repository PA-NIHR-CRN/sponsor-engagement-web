import {
  Organisation as OrganisationEntity,
  Study as StudyEntity,
  StudyFunder as StudyFunderEntity,
  StudyOrganisation as StudyOrganisationEntity,
} from 'database'

export enum StudyRecordStatus {
  Live = 'SRS_LIVE@2.16.840.1.113883.2.1.3.8.5.2.4.230',
  LiveChangesPendingApproval = 'SRS_LIVE_PDGCHGS@2.16.840.1.113883.2.1.3.8.5.2.4.230',
}

export enum StudyStatus {
  OpenToRecruitment = 'STDY_STS_CPMS_OPN_TO_RCRTMNT@2.16.840.1.113883.2.1.3.8.5.2.4.68',
  OpenActivelyRecruiting = 'STDY_STS_CPMS_OPN_ACTVLY_RECRTG@2.16.840.1.113883.2.1.3.8.5.2.4.68',
  ClosedInFollowUp = 'STDY_STS_CPMS_CLD_FLW_UP@2.16.840.1.113883.2.1.3.8.5.2.4.68',
  SuspendedOpenRecruitment = 'STDY_STS_CPMS_SPNDED_OPN_TO_RCRTMNT@2.16.840.1.113883.2.1.3.8.5.2.4.68',
  SuspendedActivelyRecruiting = 'STDY_STS_CPMS_SPNDED_OPN_ACTVLY_RECRTG@2.16.840.1.113883.2.1.3.8.5.2.4.68',
  InSetupPendingApplication = 'STDY_STS_CPMS_STP_PNDNG_APP@2.16.840.1.113883.2.1.3.8.5.2.4.68',
  InSetupPendingNHSPerm = 'STDY_STS_CPMS_STP_PNDNG_NHS_PERM@2.16.840.1.113883.2.1.3.8.5.2.4.68',
  InSetupRecruiting = 'STDY_STS_CPMS_IN_STP_APP_REC@2.16.840.1.113883.2.1.3.8.5.2.4.68',
  InSetupPermissionReceived = 'STDY_STS_CPMS_IN_STP_NHS_PERM_REC@2.16.840.1.113883.2.1.3.8.5.2.4.68',
}

export type StudyOrganisationWithRelations = StudyOrganisationEntity & {
  organisation: OrganisationEntity
}

export type StudyFunderWithRelations = StudyFunderEntity & {
  organisation: OrganisationEntity
}

export type StudyWithRelations = StudyEntity & {
  organisations: StudyOrganisationWithRelations[]
  funders: StudyFunderWithRelations[]
}

export interface Pokedex {
  Version: string
  StatusCode: number
  Result: PokedexResult
}

export interface PokedexResult {
  Studies: Study[]
  TotalRecords: number
  PageSize: number
  CurrentPageNumber: number
  Result: ResultResult
}

export interface ResultResult {
  Result: string
  Errors: null
  DetailedErrors: null
  Entity: null
}

export interface Study {
  Id: number
  Name: string
  Status: Status
  StudyRecordStatus: StudyRecordStatus
  StudyRoute: StudyRoute
  IrasId: null | string
  ProtocolReferenceNumber: null | string
  SampleSize: number | null
  ChiefInvestigatorFirstName: null | string
  ChiefInvestigatorLastName: null | string
  ManagingSpecialty: ManagingSpecialty
  QualificationDate: null | string
  PlannedRecruitmentStartDate: null | string
  PlannedRecruitmentEndDate: null | string
  ActualOpeningDate: null | string
  ActualClosureDate: null | string
  StudyEvaluationCategories: StudyEvaluationCategory[]
  StudySponsors: StudySponsor[]
  StudyFunders: StudyFunder[]
}

export enum ManagingSpecialty {
  Ageing = 'Ageing',
  AnaesthesiaPerioperativeMedicineAndPainManagement = 'Anaesthesia, Perioperative Medicine and Pain Management',
  Cancer = 'Cancer',
  CardiovascularDisease = 'Cardiovascular Disease',
  Children = 'Children',
  CriticalCare = 'Critical Care',
  DementiasAndNeurodegeneration = 'Dementias and Neurodegeneration',
  Diabetes = 'Diabetes',
  Gastroenterology = 'Gastroenterology',
  Genetics = 'Genetics',
  Haematology = 'Haematology',
  HealthServicesResearch = 'Health Services Research',
  Hepatology = 'Hepatology',
  Infection = 'Infection',
  MentalHealth = 'Mental Health',
  MetabolicAndEndocrineDisorders = 'Metabolic and Endocrine Disorders',
  MusculoskeletalDisorders = 'Musculoskeletal Disorders',
  NeurologicalDisorders = 'Neurological Disorders',
  Ophthalmology = 'Ophthalmology',
  OralAndDentalHealth = 'Oral and Dental Health',
  PrimaryCare = 'Primary Care',
  PublicHealth = 'Public Health',
  RenalDisorders = 'Renal Disorders',
  ReproductiveHealthAndChildbirth = 'Reproductive Health and Childbirth',
  RespiratoryDisorders = 'Respiratory Disorders',
  Stroke = 'Stroke',
  Surgery = 'Surgery',
  TraumaAndEmergencyCare = 'Trauma and Emergency Care',
}

export enum Status {
  ClosedToRecruitmentFollowUpComplete = 'Closed to Recruitment, Follow Up Complete',
  ClosedToRecruitmentInFollowUp = 'Closed to Recruitment, In Follow Up',
  ClosedToRecruitmentNoFollowUp = 'Closed to Recruitment, No Follow Up',
  InSetupNHSPermissionReceived = 'In Setup, NHS Permission Received',
  OpenWithRecruitment = 'Open, With Recruitment',
  Suspended = 'Suspended',
  WithdrawnDuringSetup = 'Withdrawn During Setup',
}

export interface StudyEvaluationCategory {
  EvaluationCategoryType: string
  EvaluationCategoryValue: string
  SampleSize: number
  TotalRecruitmentToDate: number
  PlannedRecruitmentStartDate: string | null
  PlannedRecruitmentEndDate: string | null
  ActualOpeningDate: string | null
  ActualClosedDate: string | null
  ExpectedReopenDate: string | null
}

export enum EvaluationCategoryType {
  Milestone = 'Milestone',
  Recruitment = 'Recruitment',
}

export enum EvaluationCategoryValue {
  StudyIsBehindPlannedRecruitment = 'Study is behind planned recruitment',
  StudyIsPastPlannedOpeningDate = 'Study is past planned opening date',
}

export interface StudyFunder {
  FunderName: string
  GrantCode: string
  FundingStreamName: null | string
  OrganisationRTSIdentifier: string
  OrganisationRoleRTSIdentifier: StudyFunderOrganisationRoleRTSIdentifier
  OrganisationRole: StudyFunderOrganisationRole
}

export enum StudyFunderOrganisationRole {
  ClinicalResearchFunder = 'Clinical Research Funder',
}

export enum StudyFunderOrganisationRoleRTSIdentifier {
  Crfndr216840111388321385111107 = 'CRFNDR@2.16.840.1.113883.2.1.3.8.5.11.1.107',
}

export enum StudyRoute {
  Commercial = 'Commercial',
  NonCommercial = 'Non-commercial',
}

export interface StudySponsor {
  OrganisationName: string
  OrganisationRole: StudySponsorOrganisationRole
  OrganisationRTSIdentifier: string
  OrganisationRoleRTSIdentifier: StudySponsorOrganisationRoleRTSIdentifier
}

export enum StudySponsorOrganisationRole {
  ClinicalResearchSponsor = 'Clinical Research Sponsor ',
  ContractResearchOrganisation = 'Contract Research Organisation',
  ManagingClinicalTrialsUnit = 'Managing Clinical Trials Unit',
}

export enum StudySponsorOrganisationRoleRTSIdentifier {
  Cro216840111388321385111107 = 'CRO@2.16.840.1.113883.2.1.3.8.5.11.1.107',
  Crspnsr21684011138835110 = 'CRSPNSR@2.16.840.1.113883.5.110',
  MNGCtu216840111388321385111107 = 'MNG_CTU@2.16.840.1.113883.2.1.3.8.5.11.1.107',
}
