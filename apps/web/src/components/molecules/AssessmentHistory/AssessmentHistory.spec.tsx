import React from 'react'
import { render, screen } from '@testing-library/react'
import { Mock } from 'ts-mockery'
import type { AssessmentHistoryProps, Study } from './AssessmentHistory'
import { AssessmentHistory, getAssessmentHistoryFromStudy } from './AssessmentHistory'

type Assessments = AssessmentHistoryProps['assessments']

describe('Assessment History', () => {
  const defaultProps: AssessmentHistoryProps = {
    heading: 'Assessment History',
    assessments: [],
  }

  const sampleAssessments: Assessments = [
    {
      id: 1,
      status: 'On track',
      createdAt: '2023-09-15',
      createdBy: 'user@example.com',
      furtherInformation: ['Info 1', 'Info 2'],
      furtherInformationText: 'Additional Info Text',
    },
    {
      id: 2,
      status: 'Off track',
      createdAt: '2023-09-20',
      createdBy: 'another@example.com',
      furtherInformation: ['Info 3'],
      furtherInformationText: null,
    },
  ]

  test('default props and no assessments', () => {
    render(<AssessmentHistory {...defaultProps} />)

    // Check if the heading and message for no assessments are present
    const headingElement = screen.getByRole('heading', { level: 3, name: 'Assessment History' })
    const noAssessmentsMessageElement = screen.getByText('This study has not had any assessments provided')

    expect(headingElement).toBeInTheDocument()
    expect(noAssessmentsMessageElement).toBeInTheDocument()
  })

  test('with multiple assessments', () => {
    render(<AssessmentHistory assessments={sampleAssessments} heading="Assessment History" />)

    // Check if the heading is present
    const headingElement = screen.getByRole('heading', { level: 3, name: 'Assessment History' })
    expect(headingElement).toBeInTheDocument()

    // Check if each assessment data is present in the rendered output
    sampleAssessments.forEach((assessment) => {
      const accordionTrigger = screen.getByRole('button', {
        name: `${assessment.createdAt} ${assessment.status} assessed by ${assessment.createdBy}`,
      })
      expect(accordionTrigger).toBeInTheDocument()
    })
  })

  test('default the first assessment expanded', () => {
    render(<AssessmentHistory assessments={sampleAssessments} firstItemExpanded heading="Assessment History" />)

    expect(
      screen.getByRole('button', {
        name: `${sampleAssessments[0].createdAt} ${sampleAssessments[0].status} assessed by ${sampleAssessments[0].createdBy}`,
      })
    ).toHaveAttribute('aria-expanded', 'true')

    expect(screen.getByText('Info 1')).toBeInTheDocument()
    expect(screen.getByText('Info 2')).toBeInTheDocument()
    expect(screen.getByText('Additional Info Text')).toBeInTheDocument()

    expect(screen.queryByText('Info 3')).not.toBeInTheDocument()
  })

  test('default the first assessment expanded with no further information', () => {
    render(
      <AssessmentHistory
        assessments={sampleAssessments.map((item) => ({
          ...item,
          furtherInformation: [],
          furtherInformationText: undefined,
        }))}
        firstItemExpanded
        heading="Assessment History"
      />
    )

    expect(
      screen.getByRole('button', {
        name: `${sampleAssessments[0].createdAt} ${sampleAssessments[0].status} assessed by ${sampleAssessments[0].createdBy}`,
      })
    ).toHaveAttribute('aria-expanded', 'false')
  })
})

describe('getAssessmentHistoryFromStudy', () => {
  test('returns empty array when study has no assessments', () => {
    const studyWithNoAssessments = Mock.of<Study>({
      assessments: [],
    })
    const result = getAssessmentHistoryFromStudy(studyWithNoAssessments)
    expect(result).toEqual([])
  })

  test('maps assessments when study has assessment data', () => {
    const studyWithAssessments = Mock.of<Study>({
      assessments: [
        {
          id: 1,
          status: {
            name: 'On track',
          },
          createdAt: new Date('2001-01-01'),
          createdBy: { email: 'user@example.com' },
          furtherInformation: [
            { furtherInformationText: 'Info 1' },
            { furtherInformationText: null, furtherInformation: { name: 'Info 2' } },
          ],
        },
        {
          id: 2,
          status: { name: 'Off track' },
          createdAt: new Date('2001-01-05'),
          createdBy: { email: 'another@example.com' },
          furtherInformation: [],
        },
      ],
    })

    const result = getAssessmentHistoryFromStudy(studyWithAssessments)

    expect(result).toEqual([
      {
        id: 1,
        status: 'On track',
        createdAt: '1 January 2001',
        createdBy: 'user@example.com',
        furtherInformation: ['Info 2'],
        furtherInformationText: 'Info 1',
      },
      {
        id: 2,
        status: 'Off track',
        createdAt: '5 January 2001',
        createdBy: 'another@example.com',
        furtherInformation: [],
        furtherInformationText: undefined,
      },
    ])
  })
})
