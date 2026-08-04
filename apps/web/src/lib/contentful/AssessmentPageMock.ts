import { BLOCKS } from '@contentful/rich-text-types'
import type { Entry } from 'contentful'

import type { TypeSetAssessmentFormPageSkeleton } from '@/@types/generated'

export const AssessmentPageMock: Entry<TypeSetAssessmentFormPageSkeleton> = {
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
        id: 'space-id',
      },
    },
    id: '2zXM1hvwIfpalQQbVv2q8E',
    type: 'Entry',
    createdAt: '2026-04-24T08:29:25.683Z',
    updatedAt: '2026-04-27T10:03:44.282Z',
    environment: {
      sys: {
        id: 'uat',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    revision: 5,
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: 'setAssessmentFormPage',
      },
    },
    locale: 'en-GB',
  },
  fields: {
    pageTitle: 'Assess progress of a study in the UK',
    pageDescription: {
      data: {},
      content: [
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value:
                'You will need to assess if the study is on or off track in the UK and if any action is being taken. If you need NIHR RDN support with this study you will need to request this separately.',
              nodeType: 'text',
            },
          ],
          nodeType: BLOCKS.PARAGRAPH,
        },
      ],
      nodeType: BLOCKS.DOCUMENT,
    },
    studyProgressionQuestionLabel: 'Is this study progressing in the UK as planned?',
    additionalInfoLabel:
      'Is there any additional information that would help NIHR RDN understand this progress assessment? (optional)',
    furtherInformationLabel: 'Further information (optional)',
    guidanceTextOnTrack: 'The sponsor or delegate is satisfied the study is progressing in the UK as planned.',
    guidanceTextOffTrack: 'The sponsor or delegate has some concerns about the study in the UK and is taking action where appropriate.',
  },
}
