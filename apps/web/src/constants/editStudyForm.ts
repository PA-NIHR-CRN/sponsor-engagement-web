import type { DateFieldName } from '@/utils/schemas'

export const PAGE_TITLE = 'Update study data'
export const GENERIC_STUDIES_GUIDANCE_TEXT =
  'Changes to the study status, the key dates and recruitment targets will be communicated to RDN, where possible, your changes will update the study record automatically in CPMS, other changes might be subject to review by the RDN team.'

export enum FormStudyStatus {
  InSetup = 'In setup',
  OpenToRecruitment = 'Open to recruitment',
  ClosedFollowUp = 'Closed to Recruitment, In Follow Up',
  Closed = 'Closed',
  Withdrawn = 'Withdrawn',
  Suspended = 'Suspended',
}

export const studyStatuses = [
  {
    name: 'In setup',
    description: 'Not yet open to recruitment.',
    id: '1',
    value: FormStudyStatus.InSetup,
  },
  {
    name: 'Open to recruitment',
    description: 'Ready (open) to recruit participants in at least one UK site. Provide an actual opening date below.',
    id: '2',
    value: FormStudyStatus.OpenToRecruitment,
  },
  {
    name: 'Closed, in follow-up',
    description:
      'Ongoing, (i.e. participants are being treated or observed), but recruitment is complete. Provide an actual closure date below.',
    id: '3',
    value: FormStudyStatus.ClosedFollowUp,
  },
  {
    name: 'Closed',
    description:
      'Completed recruitment and any subsequent patient related activities (follow up). Provide an actual closure date below.',
    id: '4',
    value: FormStudyStatus.Closed,
  },
  {
    name: 'Withdrawn',
    description: 'Withdrawn during the setup phase and will not be opening to recruitment in the UK.',
    id: '5',
    value: FormStudyStatus.Withdrawn,
  },
  {
    name: 'Suspended',
    description: 'Recruitment of participants has halted, but may resume. Provide an estimated re-opening date below.',
    id: '6',
    value: FormStudyStatus.Suspended,
  },
]

/**
 * Max amount of characters for furtherInformation text
 */
export const FURTHER_INFO_MAX_CHARACTERS = 500
export const UK_RECRUITMENT_TARGET_MAX_VALUE = 9999999

export const fieldNameToLabelMapping: Record<keyof DateFieldName, string> = {
  plannedOpeningDate: 'Planned opening to recruitment date',
  actualOpeningDate: 'Actual opening to recruitment date',
  plannedClosureDate: 'Planned closure to recruitment date',
  actualClosureDate: 'Actual closure to recruitment date',
  estimatedReopeningDate: 'Estimated reopening date',
}

export type DateRestrictions = 'requiredPast' | 'requiredCurrent' | 'requiredFuture'

/**
 * Date validation rules and dependencies
 */
export const dateValidationRules: Record<
  keyof DateFieldName,
  { restrictions: DateRestrictions[]; dependencies: { fieldName: keyof DateFieldName; requiredAfter?: boolean }[] }
> = {
  plannedOpeningDate: { restrictions: [], dependencies: [] },
  actualOpeningDate: { restrictions: ['requiredPast', 'requiredCurrent'], dependencies: [] },
  plannedClosureDate: {
    restrictions: [],
    dependencies: [
      {
        fieldName: 'plannedOpeningDate',
        requiredAfter: true,
      },
      {
        fieldName: 'actualOpeningDate',
        requiredAfter: true,
      },
    ],
  },
  actualClosureDate: { restrictions: ['requiredPast', 'requiredCurrent'], dependencies: [] },
  estimatedReopeningDate: { restrictions: ['requiredFuture'], dependencies: [] },
}
