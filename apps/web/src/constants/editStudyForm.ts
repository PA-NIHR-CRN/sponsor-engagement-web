export const PAGE_TITLE = 'Update study data'
export const NON_COMMERCIAL_GUIDANCE_TEXT =
  'Changes to study status and UK recruitment target will be committed to CPMS after review. All other changes will be committed directly without manual review.'
export const COMMERCIAL_GUIDANCE_TEXT =
  'Changes to study status will be committed to CPMS after review. All other changes will be committed directly without manual review.'

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
    description: 'Ready (open) to recruit participants in at least one UK site.',
    id: '2',
    value: StudyStatus.OpenToRecruitment,
  },
  {
    name: 'Closed, in follow-up',
    description: 'Ongoing, (i.e. participants are being treated or observed), but recruitment is complete.',
    id: '3',
    value: StudyStatus.ClosedFollowUp,
  },
  {
    name: 'Closed',
    description: 'Completed recruitment and any subsequent patient related activities (follow up).',
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
    description: 'Recruitment of participants has halted, but may resume.',
    id: '6',
    value: StudyStatus.Suspended,
  },
]
