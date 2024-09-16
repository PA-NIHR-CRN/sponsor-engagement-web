import { simpleFaker } from '@faker-js/faker'
import type { Prisma } from 'database'
import { Mock } from 'ts-mockery'

import type { Study } from '@/@types/studies'
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

export const mockCPMSStudy = Mock.of<Study>({
  StudyId: 622,
  StudyShortName: 'BS06',
  StudyStatus: 'Suspended',
  StudyRoute: 'Non-commercial',
  PlannedOpeningDate: '2003-02-28T00:00:00',
  PlannedClosureToRecruitmentDate: '2003-02-28T00:00:00',
  ActualOpeningDate: '1991-09-01T00:00:00',
  ActualClosureToRecruitmentDate: '2003-02-28T00:00:00',
  TotalRecruitmentToDate: 683,
  UkRecruitmentTargetToDate: 121,
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
      ActualClosureDate: null,
      ExpectedReopenDate: null,
    },
  ],
})

export const mappedCPMSStudyEvals = [
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
  plannedClosureDate: new Date('2001-01-01'),
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
