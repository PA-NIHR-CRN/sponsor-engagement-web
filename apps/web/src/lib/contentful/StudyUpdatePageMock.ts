import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import type { Entry } from 'contentful'

import type { TypeStudyDataFormSkeleton } from '@/@types/generated'

export const StudyUpdatePageMock: Entry<TypeStudyDataFormSkeleton> = {
  metadata: {
    tags: [
      {
        sys: {
          type: 'Link',
          linkType: 'Tag',
          id: 'sponsorEngagement',
        },
      },
    ],
    concepts: [],
  },
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: 'Study-details-id',
      },
    },
    id: 'Study-details-id',
    type: 'Entry',
    createdAt: '2026-04-24T08:46:21.035Z',
    updatedAt: '2026-04-29T13:31:23.981Z',
    environment: {
      sys: {
        id: 'uat',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    revision: 4,
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: 'studyDataForm',
      },
    },
    locale: 'en-GB',
  },
  fields: {
    pageTitle: 'Update UK study data',
    pageDescription: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value:
                'Changes to the study status, the key dates and recruitment targets will be communicated to RDN, where possible, your changes will update the study record automatically in CPMS, other changes might be subject to review by the RDN team.',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
    furtherInformationLabel: 'Further information (optional)',
    furtherInformationGuidanceText: {
      data: {},
      content: [
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value: 'If needed, provide further context or justification for changes made above.',
              nodeType: 'text',
            },
          ],
          nodeType: BLOCKS.PARAGRAPH,
        },
      ],
      nodeType: BLOCKS.DOCUMENT,
    },
    endMessage: {
      data: {},
      content: [
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value: 'If you need support updating your data, please ',
              nodeType: 'text',
            },
            {
              data: {
                uri: 'mailto:supportmystudy@nihr.ac.uk',
              },
              content: [
                {
                  data: {},
                  marks: [],
                  value: 'contact the RDN Team',
                  nodeType: 'text',
                },
              ],
              nodeType: INLINES.HYPERLINK,
            },
            {
              data: {},
              marks: [],
              value: '',
              nodeType: 'text',
            },
          ],
          nodeType: BLOCKS.PARAGRAPH,
        },
      ],
      nodeType: BLOCKS.DOCUMENT,
    },
    guidanceTextInSetup:'Not yet open to recruitment.',
    guidanceTextOpenToRecruitment:'Open to recruit participants in at least one UK site. Provide an actual opening date below.',
    guidanceTextClosedInFollowUp:'Ongoing, (i.e. participants are being treated or observed), but recruitment is complete. Provide an actual closure date below.',
    guidanceTextClosed:'Completed recruitment and any subsequent patient related activities (follow up). Provide an actual closure date below.',
    guidanceTextWithdrawn:'Withdrawn during the setup phase and will not be opening to recruitment in the UK.',
    guidanceTextSuspended:'Recruitment of participants has halted, but may resume. Provide an estimated re-opening date below.',
  },
}
