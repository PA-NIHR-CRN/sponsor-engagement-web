import React from 'react'
import { render, screen } from '../../../../config/TestUtils'
import type { StudyListProps } from './StudyList'
import { StudyList } from './StudyList'

describe('StudyList Component', () => {
  const defaultProps: StudyListProps = {
    sponsorOrgName: 'Sponsor ABC',
    shortTitle: 'Study XYZ',
    shortTitleHref: '/study/xyz',
    lastAsessmentDate: '2023-09-30',
    assessmentHref: '/assessments/xyz',
    trackStatus: 'On track',
    trackStatusHref: '/track/on',
    indications: ['Indication ABC'],
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
    const assessButtonElement = screen.getByText('Assess')

    expect(sponsorNameElement).toBeInTheDocument()
    expect(shortTitleElement).toHaveAttribute('href', defaultProps.shortTitleHref)
    expect(lastAssessmentTrackStatusElement).toHaveAttribute('href', defaultProps.trackStatusHref)
    expect(lastAssessmentDateHeading).toBeInTheDocument()
    expect(lastAssessmentDateElement).toBeInTheDocument()
    expect(indicationHeading).toBeInTheDocument()
    expect(indicationElement).toBeInTheDocument()
    expect(assessButtonElement).toHaveAttribute('href', defaultProps.assessmentHref)
  })

  test('renders "Due" tag when assessmentDue is true', () => {
    render(<StudyList {...defaultProps} assessmentDue />)

    // Check if the "Due" tag is rendered
    const dueTagElement = screen.getByText('Due')
    expect(dueTagElement).toBeInTheDocument()
  })

  test('does not render "Due" tag when assessmentDue is false', () => {
    render(<StudyList {...defaultProps} assessmentDue={false} />)

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
