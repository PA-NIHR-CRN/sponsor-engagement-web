import { simpleFaker } from '@faker-js/faker'
import { Mock } from 'ts-mockery'

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
