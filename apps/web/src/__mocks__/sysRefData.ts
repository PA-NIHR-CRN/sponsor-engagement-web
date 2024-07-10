import type { SysRefAssessmentFurtherInformation, SysRefAssessmentStatus } from 'database'

export const sysRefAssessmentStatus: SysRefAssessmentStatus[] = [
  {
    id: 1,
    name: 'On track',
    description: 'The sponsor or delegate is satisfied the study is progressing as planned.',
    isDeleted: false,
  },
  {
    id: 2,
    name: 'Off track',
    description: 'The sponsor or delegate has some concerns about the study and is taking action where appropriate.',
    isDeleted: false,
  },
]

export const sysRefAssessmentFurtherInformation: SysRefAssessmentFurtherInformation[] = [
  {
    id: 1,
    name: 'Study no longer going ahead in the UK [withdrawn during setup]',
    sortOrder: 1,
    description: '',
    isDeleted: false,
  },
  {
    id: 2,
    name: 'Waiting for HRA or MHRA approvals',
    sortOrder: 2,
    description: '',
    isDeleted: false,
  },
  {
    id: 3,
    name: 'Waiting for site approval or activation',
    sortOrder: 3,
    description: '',
    isDeleted: false,
  },
  {
    id: 4,
    name: 'In process of seeking an extension or protocol amendment',
    sortOrder: 4,
    description: '',
    isDeleted: false,
  },
  {
    id: 5,
    name: 'Work in progress with RDN to update key milestones and recruitment activity',
    sortOrder: 5,
    description: '',
    isDeleted: false,
  },
  {
    id: 6,
    name: 'In discussion with stakeholders to agree next steps',
    sortOrder: 6,
    description: '',
    isDeleted: false,
  },
  {
    id: 7,
    name: 'No recruitment expected within the last 90 days, in line with the study plan',
    sortOrder: 7,
    description: '',
    isDeleted: false,
  },
  {
    id: 8,
    name: 'Study closed to recruitment, in follow up',
    sortOrder: 8,
    description: '',
    isDeleted: false,
  },
  {
    id: 9,
    name: 'Follow up complete or none required',
    sortOrder: 9,
    description: '',
    isDeleted: false,
  },
  {
    id: 10,
    name: 'Work in progress to close study in the UK',
    sortOrder: 10,
    description: '',
    isDeleted: false,
  },
]
