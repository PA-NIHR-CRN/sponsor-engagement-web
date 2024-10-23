import { simpleFaker } from '@faker-js/faker'
import type { Prisma } from 'database'
import { Mock } from 'ts-mockery'

import type { CPMSValidationResult, Study } from '@/@types/studies'
import {
  StudySponsorOrganisationRole,
  StudySponsorOrganisationRoleRTSIdentifier,
  StudyUpdateRoute,
} from '@/@types/studies'
import { StudyUpdateState, StudyUpdateType } from '@/constants'
import type { UpdateStudyInput } from '@/lib/cpms/studies'
import type { StudyForExport } from '@/lib/studies'

export const mockStudiesForExport = Array.from({ length: 3 }).map((_, index) =>
  Mock.of<StudyForExport>({
    id: simpleFaker.number.int(),
    cpmsId: simpleFaker.number.int(),
    irasId: simpleFaker.string.numeric(),
    route: index === 0 ? 'Commercial' : 'Non-commercial',
    protocolReferenceNumber: simpleFaker.string.numeric(),
    title: 'Test Study Long Title',
    shortTitle: 'Test Study Short Title',
    chiefInvestigatorFirstName: simpleFaker.string.alpha(),
    chiefInvestigatorLastName: simpleFaker.string.alpha(),
    studyStatus: 'Live',
    plannedOpeningDate: simpleFaker.date.future(),
    plannedClosureDate: simpleFaker.date.future(),
    actualOpeningDate: simpleFaker.date.future(),
    actualClosureDate: simpleFaker.date.future(),
    sampleSize: simpleFaker.number.int(),
    totalRecruitmentToDate: simpleFaker.number.int(),
    isDueAssessment: index === 0,
    organisations: [
      {
        organisation: {
          id: simpleFaker.number.int(),
          name: 'Test Clinical Research Sponsor',
        },
        organisationRole: {
          id: simpleFaker.number.int(),
          name: 'Clinical Research Sponsor',
        },
      },
      {
        organisation: {
          id: simpleFaker.number.int(),
          name: 'Test Contract Research Organisation',
        },
        organisationRole: {
          id: simpleFaker.number.int(),
          name: 'Contract Research Organisation',
        },
      },
    ],
    evaluationCategories: [
      {
        indicatorType: 'Milestone missed',
        updatedAt: new Date('2001-01-01'),
        createdAt: new Date('2001-01-01'),
      },
      {
        indicatorType: 'Recruitment concerns',
        updatedAt: new Date('2001-01-01'),
        createdAt: new Date('2001-01-01'),
      },
      {
        indicatorType: 'Milestone missed',
        updatedAt: new Date('2001-01-01'),
        createdAt: new Date('2001-01-01'),
      },
    ],
    lastAssessment: {
      status: { name: 'Off Track' },
      updatedAt: new Date('2001-01-02'),
      createdAt: new Date('2001-01-01'),
      furtherInformation: [
        {
          furtherInformation: {
            name: 'Test further info status',
          },
        },
        {
          furtherInformationText: 'Test further info free text',
        },
      ],
    },
  })
)

export const mockCPMSValidationResult = Mock.of<CPMSValidationResult>({
  StudyUpdateRoute: StudyUpdateRoute.Direct,
})

export const mockCPMSStudy = Mock.of<Study>({
  StudyId: 622,
  IrasId: 1212,
  StudyShortName: 'BS06',
  StudyStatus: 'Suspended (from Open to Recruitment)',
  StudyRoute: 'Non-commercial',
  ProtocolReferenceNumber: 8282,
  PlannedOpeningDate: '2003-02-28T00:00:00',
  PlannedClosureToRecruitmentDate: '2004-02-28T00:00:00',
  ActualOpeningDate: '1991-09-01T00:00:00',
  ActualClosureToRecruitmentDate: '2003-02-28T00:00:00',
  EstimatedReopeningDate: '2003-02-28T00:00:00',
  TotalRecruitmentToDate: 683,
  SampleSize: 121,
  UkRecruitmentTarget: 121,
  Title: 'A PHASE 2B',
  ManagingSpecialty: 'Musculoskeletal Disorders',
  ChiefInvestigatorFirstName: 'John',
  ChiefInvestigatorLastName: 'Smith',
  StudyEvaluationCategories: [
    {
      EvaluationCategoryType: 'Recruitment concerns',
      EvaluationCategoryValue: 'Recruitment target met',
      SampleSize: 444,
      TotalRecruitmentToDate: 683,
      PlannedRecruitmentStartDate: '2018-03-01T00:00:00',
      PlannedRecruitmentEndDate: '2025-03-31T00:00:00',
      ActualOpeningDate: '2018-03-01T00:00:00',
      ActualClosureDate: '2003-02-28T00:00:00',
      ExpectedReopenDate: '2003-02-28T00:00:00',
    },
    {
      EvaluationCategoryType: 'Recruitment concerns',
      EvaluationCategoryValue: 'No recruitment in past 6 months',
      SampleSize: 444,
      TotalRecruitmentToDate: 683,
      PlannedRecruitmentStartDate: '2018-03-01T00:00:00',
      PlannedRecruitmentEndDate: '2025-03-31T00:00:00',
      ActualOpeningDate: '2018-03-01T00:00:00',
      ActualClosureDate: '2003-02-28T00:00:00',
      ExpectedReopenDate: '2003-02-28T00:00:00',
    },
  ],
  StudySponsors: [
    {
      OrganisationName: 'Pfizer Inc.',
      OrganisationRole: StudySponsorOrganisationRole.ClinicalResearchSponsor,
      OrganisationRTSIdentifier: '69033 NY@1.2.840.1',
      OrganisationRoleRTSIdentifier: StudySponsorOrganisationRoleRTSIdentifier.ClinicalResearchSponsor,
    },
  ],
  ChangeHistory: [
    {
      Timestamp: '2024-10-15T15:05:27.767',
      Operation: 'update',
      LSN: '000065E2000058F0000A',
      Changes: [
        {
          Column: 'UkRecruitmentSampleSize',
          OldValue: '2212',
          NewValue: '12',
        },
        {
          Column: 'PlannedRecruitmentEndDate',
          OldValue: '2026-09-09T00:00:00.0000000',
          NewValue: '2026-09-08T00:00:00.0000000',
        },
        {
          Column: 'ActualOpeningDate',
          OldValue: '2015-04-25T00:00:00.0000000',
          NewValue: '2015-04-24T00:00:00.0000000',
        },
      ],
    },
    {
      Timestamp: '2024-10-15T15:04:32.23',
      Operation: 'update',
      LSN: '000065E200005848000A',
      Changes: [
        {
          Column: 'PlannedRecruitmentStartDate',
          OldValue: '2024-04-04T00:00:00.0000000',
          NewValue: '2024-09-09T00:00:00.0000000',
        },
      ],
    },
    {
      Timestamp: '2024-10-15T14:12:10.28',
      Operation: 'update',
      LSN: '000065E200004028000A',
      Changes: [
        {
          Column: 'PlannedRecruitmentStartDate',
          OldValue: '2024-10-10T00:00:00.0000000',
          NewValue: '2024-11-11T00:00:00.0000000',
        },
      ],
    },
  ],
})

export const mockCPMSUpdateInput: UpdateStudyInput = {
  StudyStatus: mockCPMSStudy.StudyStatus,
  UkRecruitmentTarget: mockCPMSStudy.SampleSize,
  PlannedOpeningDate: '2003-02-28T00:00:00.000',
  ActualOpeningDate: '1991-09-01T00:00:00.000',
  PlannedClosureToRecruitmentDate: '2004-02-28T00:00:00.000',
  ActualClosureToRecruitmentDate: '2003-02-28T00:00:00.000',
  EstimatedReopeningDate: '2003-02-28T00:00:00.000',
}

export const mappedCPMSStudyEvals: Prisma.StudyEvaluationCategoryGetPayload<undefined>[] = [
  {
    id: 43343,
    studyId: mockCPMSStudy.StudyId,
    indicatorType: mockCPMSStudy.StudyEvaluationCategories[0].EvaluationCategoryType,
    indicatorValue: mockCPMSStudy.StudyEvaluationCategories[0].EvaluationCategoryValue,
    sampleSize: mockCPMSStudy.StudyEvaluationCategories[0].SampleSize,
    totalRecruitmentToDate: mockCPMSStudy.StudyEvaluationCategories[0].TotalRecruitmentToDate,
    plannedOpeningDate: new Date(mockCPMSStudy.StudyEvaluationCategories[0].PlannedRecruitmentStartDate as string),
    plannedClosureDate: new Date(mockCPMSStudy.StudyEvaluationCategories[0].PlannedRecruitmentEndDate as string),
    actualOpeningDate: new Date(mockCPMSStudy.StudyEvaluationCategories[0].ActualOpeningDate as string),
    actualClosureDate: new Date(mockCPMSStudy.StudyEvaluationCategories[0].ActualClosureDate as string),
    expectedReopenDate: new Date(mockCPMSStudy.StudyEvaluationCategories[0].ExpectedReopenDate as string),
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 32321,
    studyId: mockCPMSStudy.StudyId,
    indicatorType: mockCPMSStudy.StudyEvaluationCategories[1].EvaluationCategoryType,
    indicatorValue: mockCPMSStudy.StudyEvaluationCategories[1].EvaluationCategoryValue,
    sampleSize: mockCPMSStudy.StudyEvaluationCategories[1].SampleSize,
    totalRecruitmentToDate: mockCPMSStudy.StudyEvaluationCategories[1].TotalRecruitmentToDate,
    plannedOpeningDate: new Date(mockCPMSStudy.StudyEvaluationCategories[1].PlannedRecruitmentStartDate as string),
    plannedClosureDate: new Date(mockCPMSStudy.StudyEvaluationCategories[1].PlannedRecruitmentEndDate as string),
    actualOpeningDate: new Date(mockCPMSStudy.StudyEvaluationCategories[1].ActualOpeningDate as string),
    actualClosureDate: new Date(mockCPMSStudy.StudyEvaluationCategories[1].ActualClosureDate as string),
    expectedReopenDate: new Date(mockCPMSStudy.StudyEvaluationCategories[1].ExpectedReopenDate as string),
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

type StudyWithRelations = Prisma.StudyGetPayload<{
  include: {
    title: true
    organisations: {
      include: {
        organisation: true
        organisationRole: true
      }
    }
    evaluationCategories: { select: { id: true; indicatorValue: true } }
    assessments: {
      include: {
        status: true
        createdBy: true
        furtherInformation: {
          include: {
            furtherInformation: true
          }
        }
      }
    }
  }
}>

export const mockStudyWithRelations = Mock.of<StudyWithRelations>({
  id: 123,
  title: 'Test Study Long Title',
  shortTitle: 'Test Study Short Title',
  isDueAssessment: false,
  cpmsId: 1234567,
  studyStatus: 'Suspended',
  recordStatus: 'Test record status',
  route: 'Commercial',
  irasId: '12345',
  protocolReferenceNumber: '123',
  sampleSize: 1000,
  chiefInvestigatorFirstName: 'John',
  chiefInvestigatorLastName: 'Smith',
  managingSpeciality: '',
  plannedOpeningDate: new Date('2001-01-01'),
  plannedClosureDate: new Date('2001-01-02'),
  actualOpeningDate: new Date('2001-01-01'),
  actualClosureDate: new Date('2001-01-01'),
  totalRecruitmentToDate: 999,
  organisations: [
    {
      organisation: {
        id: simpleFaker.number.int(),
        name: 'Test Organisation',
      },
      organisationRole: {
        id: simpleFaker.number.int(),
        name: 'Contract Research Organisation',
      },
    },
  ],
  evaluationCategories: [
    {
      id: simpleFaker.number.int(),
      indicatorValue: 'Milestone missed',
    },
  ],
  assessments: [
    {
      id: 1,
      status: { name: 'Off track' },
      createdBy: {
        email: 'mockeduser@nihr.ac.uk',
      },
      furtherInformation: [
        {
          id: 1,
          furtherInformation: {
            name: 'Mocked list item 1',
          },
        },
        {
          id: 2,
          furtherInformation: {
            name: 'Mocked list item 2',
          },
        },
        {
          id: 3,
          furtherInformation: {
            name: 'Mocked list item 3',
          },
        },
        {
          id: 4,
          furtherInformationText: 'Testing some further information',
        },
      ],
      updatedAt: new Date('2001-01-01'),
      createdAt: new Date('2001-01-01'),
    },
  ],
})

export const mockMappedAssessment = {
  createdAt: '1 January 2001',
  createdBy: 'mockeduser@nihr.ac.uk',
  furtherInformation: ['Mocked list item 1', 'Mocked list item 2', 'Mocked list item 3'],
  furtherInformationText: 'Testing some further information',
  id: 1,
  status: 'Off track',
}

export const mockStudyUpdates = [
  {
    id: 3030,
    studyId: 1,
    studyStatus: 'Suspended',
    studyStatusGroup: 'Suspended',
    plannedOpeningDate: new Date('2024-01-10T10:00:00Z'),
    actualOpeningDate: new Date('2024-02-15T09:00:00Z'),
    plannedClosureToRecruitmentDate: new Date('2024-12-01T17:00:00Z'),
    actualClosureToRecruitmentDate: new Date('2025-01-20T17:00:00Z'),
    estimatedReopeningDate: new Date('2026-01-20T17:00:00Z'),
    ukRecruitmentTarget: 500,
    studyUpdateTypeId: StudyUpdateType.Proposed,
    comment: null,
    isDeleted: null,
    LSN: Buffer.from('000065E2000058F0000A', 'hex'),
    transactionId: 'id-1',
    studyUpdateStateId: StudyUpdateState.Before,
    createdAt: new Date('2022-09-20T10:15:00Z'),
    createdById: 1,
    createdBy: {
      email: 'sponsorcontact@example.com',
    },
    modifiedAt: new Date(),
    modifiedById: 1,
  },
  {
    id: 23030,
    studyId: 1,
    studyStatus: 'Open to Recruitment',
    studyStatusGroup: 'Open to recruitment',
    plannedOpeningDate: new Date('2023-06-05T08:30:00Z'),
    actualOpeningDate: new Date('2023-06-10T08:45:00Z'),
    plannedClosureToRecruitmentDate: new Date('2024-03-10T18:00:00Z'),
    actualClosureToRecruitmentDate: new Date('2024-03-15T18:30:00Z'),
    estimatedReopeningDate: new Date('2027-01-20T17:00:00Z'),
    ukRecruitmentTarget: 300,
    studyUpdateTypeId: StudyUpdateType.Proposed,
    comment: null,
    isDeleted: null,
    LSN: null,
    transactionId: 'id-1',
    studyUpdateStateId: StudyUpdateState.Before,
    createdAt: new Date('2022-09-20T10:15:00Z'),
    createdById: 1,
    createdBy: {
      email: 'sponsorcontact@example.com',
    },
    modifiedAt: new Date(),
    modifiedById: 2,
  },
]

// Mock mapped edit history
export const mockProposedEditHistory = [
  {
    id: 'id-1',
    modifiedDate: new Date('2022-09-20T10:15:00Z').toISOString(),
    userEmail: 'sponsorcontact@example.com',
    studyUpdateType: StudyUpdateType.Proposed,
    changes: [
      {
        columnChanged: 'studyStatusGroup',
        beforeValue: 'Suspended',
        afterValue: 'Open to recruitment',
      },
      {
        columnChanged: 'plannedOpeningDate',
        beforeValue: '10 January 2024',
        afterValue: '5 June 2023',
      },
      {
        columnChanged: 'actualOpeningDate',
        beforeValue: '15 February 2024',
        afterValue: '10 June 2023',
      },
      {
        columnChanged: 'plannedClosureToRecruitmentDate',
        beforeValue: '1 December 2024',
        afterValue: '10 March 2024',
      },
      {
        columnChanged: 'actualClosureToRecruitmentDate',
        beforeValue: '20 January 2025',
        afterValue: '15 March 2024',
      },
      {
        columnChanged: 'estimatedReopeningDate',
        beforeValue: '20 January 2026',
        afterValue: '20 January 2027',
      },
      {
        columnChanged: 'ukRecruitmentTarget',
        beforeValue: '500',
        afterValue: '300',
      },
    ],
  },
]

export const getMockEditHistoryFromCPMS = (existInSE: boolean[]) => [
  {
    changes: [
      { afterValue: '12', beforeValue: '2212', columnChanged: 'UkRecruitmentSampleSize' },
      {
        afterValue: '8 September 2026',
        beforeValue: '9 September 2026',
        columnChanged: 'PlannedRecruitmentEndDate',
      },
      {
        afterValue: '24 April 2015',
        beforeValue: '25 April 2015',
        columnChanged: 'ActualOpeningDate',
      },
    ],
    id: mockCPMSStudy.ChangeHistory[0].LSN,
    modifiedDate: existInSE[0] ? '2022-09-20T10:15:00.000Z' : mockCPMSStudy.ChangeHistory[0].Timestamp,
    ...(existInSE[0] ? { studyUpdateType: StudyUpdateType.Direct, userEmail: 'sponsorcontact@example.com' } : {}),
  },
  {
    changes: [
      {
        afterValue: '9 September 2024',
        beforeValue: '4 April 2024',
        columnChanged: 'PlannedRecruitmentStartDate',
      },
    ],
    id: mockCPMSStudy.ChangeHistory[1].LSN,
    modifiedDate: existInSE[1] ? '2022-09-20T10:15:00.000Z' : mockCPMSStudy.ChangeHistory[1].Timestamp,
    ...(existInSE[1] ? { studyUpdateType: StudyUpdateType.Direct, userEmail: 'sponsorcontact@example.com' } : {}),
  },
  {
    changes: [
      {
        afterValue: '11 November 2024',
        beforeValue: '10 October 2024',
        columnChanged: 'PlannedRecruitmentStartDate',
      },
    ],
    id: mockCPMSStudy.ChangeHistory[2].LSN,
    modifiedDate: existInSE[2] ? '2022-09-20T10:15:00.000Z' : mockCPMSStudy.ChangeHistory[2].Timestamp,
    ...(existInSE[2] ? { studyUpdateType: StudyUpdateType.Direct, userEmail: 'sponsorcontact@example.com' } : {}),
  },
]
