export const PAGE_TITLE = 'Update study data'
export const NON_COMMERCIAL_GUIDANCE_TEXT =
  'Changes to study status and UK recruitment target will be committed to CPMS after review. All other changes will be committed directly without manual review.'
export const COMMERCIAL_GUIDANCE_TEXT =
  'Changes to study status will be committed to CPMS after review. All other changes will be committed directly without manual review.'

export const studyStatuses = [
  {
    name: 'In setup',
    description: 'Not yet open to recruitment.',
    id: '1',
  },
  {
    name: 'Open to recruitment',
    description: 'Ready (open) to recruit participants in at least one UK site.',
    id: '2',
  },
  {
    name: 'Closed, in follow-up',
    description: 'Ongoing, (i.e. participants are being treated or observed), but recruitment is complete.',
    id: '3',
  },
  {
    name: 'Closed',
    description: 'Completed recruitment and any subsequent patient related activities (follow up).',
    id: '4',
  },
  {
    name: 'Withdrawn',
    description: 'Withdrawn during the setup phase and will not be opening to recruitment in the UK.',
    id: '5',
  },
  {
    name: 'Suspended',
    description: 'Recruitment of participants has halted, but may resume.',
    id: '6',
  },
]
