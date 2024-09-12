export const PAGE_TITLE = 'Update study data'
export const GENERIC_STUDIES_GUIDANCE_TEXT =
  'Changes to the study status, the key dates and recruitment targets will be communicated to RDN, where possible, your changes will update the study record automatically in CPMS, other changes might be subject to review by the RDN team.'

enum StudyStatus {
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
    value: StudyStatus.InSetup,
  },
  {
    name: 'Open to recruitment',
    description: 'Ready (open) to recruit participants in at least one UK site. Provide an actual opening date below.',
    id: '2',
    value: StudyStatus.OpenToRecruitment,
  },
  {
    name: 'Closed, in follow-up',
    description:
      'Ongoing, (i.e. participants are being treated or observed), but recruitment is complete. Provide an actual closure date below.',
    id: '3',
    value: StudyStatus.ClosedFollowUp,
  },
  {
    name: 'Closed',
    description:
      'Completed recruitment and any subsequent patient related activities (follow up). Provide an actual closure date below.',
    id: '4',
    value: StudyStatus.Closed,
  },
  {
    name: 'Withdrawn',
    description: 'Withdrawn during the setup phase and will not be opening to recruitment in the UK.',
    id: '5',
    value: StudyStatus.Withdrawn,
  },
  {
    name: 'Suspended',
    description: 'Recruitment of participants has halted, but may resume. Provide an estimated re-opening date below.',
    id: '6',
    value: StudyStatus.Suspended,
  },
]
