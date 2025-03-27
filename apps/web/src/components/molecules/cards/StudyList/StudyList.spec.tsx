import React from 'react'

import { render, screen } from '@/config/TestUtils'

import type { StudyListProps } from './StudyList'
import { StudyList } from './StudyList'

describe('StudyList Component', () => {
  const defaultProps: StudyListProps = {
    sponsorOrgName: 'Sponsor ABC',
    shortTitle: 'Study XYZ',
    studyHref: '/studies/xyz',
    lastAssessmentDate: '2023-09-30',
    trackStatus: 'On track',
    trackStatusHref: '/track/on',
    indications: ['Indication ABC'],
    daysSinceAssessmentDue: null,
  }

  test('renders with default props', () => {
    render(<StudyList {...defaultProps} />)

    // Check if default content is present in the rendered output
    const sponsorNameElement = screen.getByText('Sponsor ABC')
    const shortTitleElement = screen.getByText('Study XYZ')
    const lastAssessmentTrackStatusElement = screen.getByText('On track')
    const lastAssessmentDateHeading = screen.getByText('Last sponsor assessment')
    const lastAssessmentDateElement = screen.getByText('on 2023-09-30')
    const indicationHeading = screen.getByText('Study data indicates')
    const indicationElement = screen.getByText('Indication ABC')
    const viewStudyButtonElement = screen.getByText('View study')

    expect(sponsorNameElement).toBeInTheDocument()
    expect(shortTitleElement).toBeInTheDocument()
    expect(lastAssessmentTrackStatusElement).toHaveAttribute('href', defaultProps.trackStatusHref)
    expect(lastAssessmentDateHeading).toBeInTheDocument()
    expect(lastAssessmentDateElement).toBeInTheDocument()
    expect(indicationHeading).toBeInTheDocument()
    expect(indicationElement).toBeInTheDocument()
    expect(viewStudyButtonElement).toHaveAttribute('href', defaultProps.studyHref)
  })

  test('renders correct "Due" tag when daysSinceAssessmentDue is 0', () => {
    render(<StudyList {...defaultProps} daysSinceAssessmentDue={0} />)

    // Check if the "Due" tag is rendered
    const dueTagElement = screen.getByText('Due for 1 day')
    expect(dueTagElement).toBeInTheDocument()
  })

  test('renders "Due" tag when daysSinceAssessmentDue is 1', () => {
    render(<StudyList {...defaultProps} daysSinceAssessmentDue={1} />)

    // Check if the "Due" tag is rendered
    const dueTagElement = screen.getByText('Due for 1 day')
    expect(dueTagElement).toBeInTheDocument()
  })

  test('renders "Due" tag when daysSinceAssessmentDue is greater than 1', () => {
    render(<StudyList {...defaultProps} daysSinceAssessmentDue={2} />)

    // Check if the "Due" tag is rendered
    const dueTagElement = screen.getByText('Due for 2 days')
    expect(dueTagElement).toBeInTheDocument()
  })

  test('does not render "Due" tag when daysSinceAssessmentDue is undefined', () => {
    render(<StudyList {...defaultProps} daysSinceAssessmentDue={null} />)

    // Check if the "Due" tag is not rendered
    const dueTagElement = screen.queryByText('Due')
    expect(dueTagElement).toBeNull()
  })

  test('renders with different sponsorName and shortTitle', () => {
    const props: StudyListProps = {
      ...defaultProps,
      sponsorOrgName: 'New Sponsor',
      shortTitle: 'New Study',
    }
    render(<StudyList {...props} />)

    // Check if the updated sponsorName and shortTitle are present
    const sponsorNameElement = screen.getByText('New Sponsor')
    const shortTitleElement = screen.getByText('New Study')

    expect(sponsorNameElement).toBeInTheDocument()
    expect(shortTitleElement).toBeInTheDocument()
  })

  test('renders support organisation (i.e. CTU or CRO) name when provided', () => {
    const props: StudyListProps = {
      ...defaultProps,
      supportOrgName: 'Support Org ABC',
    }
    render(<StudyList {...props} />)

    expect(screen.getByText('Sponsor ABC (Support Org ABC)')).toBeInTheDocument()
  })
})
