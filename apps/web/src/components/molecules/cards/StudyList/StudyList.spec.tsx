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
    indications: undefined,
    daysSinceAssessmentDue: null,
    irasId: '31832',
  }

  test('renders with default props', () => {
    render(<StudyList {...defaultProps} />)

    // Check if default content is present in the rendered output
    const sponsorNameElement = screen.getByText('Sponsor ABC')
    const shortTitleElement = screen.getByText('Study XYZ')
    const irasIdElement = screen.getByText('IRAS ID: 31832')
    const lastAssessmentTrackStatusElement = screen.getByText('On track')
    const lastAssessmentDateHeading = screen.getByText('Last sponsor assessment')
    const lastAssessmentDateElement = screen.getByText('on 2023-09-30')
    const viewStudyButtonElement = screen.getByText('View study')

    expect(sponsorNameElement).toBeInTheDocument()
    expect(shortTitleElement).toBeInTheDocument()
    expect(irasIdElement).toBeInTheDocument()
    expect(lastAssessmentTrackStatusElement).toHaveAttribute('href', defaultProps.trackStatusHref)
    expect(lastAssessmentDateHeading).toBeInTheDocument()
    expect(lastAssessmentDateElement).toBeInTheDocument()
    expect(viewStudyButtonElement).toHaveAttribute('href', defaultProps.studyHref)
  })

  test('renders correct "Due" tag when daysSinceAssessmentDue is 0', () => {
    render(<StudyList {...defaultProps} daysSinceAssessmentDue={0} />)

    // Check if the "Due" tag is rendered
    const dueTagElement = screen.getByText('Assessment due for 1 day')
    expect(dueTagElement).toBeInTheDocument()
  })

  test('renders "Due" tag when daysSinceAssessmentDue is 1', () => {
    render(<StudyList {...defaultProps} daysSinceAssessmentDue={1} />)

    // Check if the "Due" tag is rendered
    const dueTagElement = screen.getByText('Assessment due for 1 day')
    expect(dueTagElement).toBeInTheDocument()
  })

  test('renders "Due" tag when daysSinceAssessmentDue is greater than 1', () => {
    render(<StudyList {...defaultProps} daysSinceAssessmentDue={2} />)

    // Check if the "Due" tag is rendered
    const dueTagElement = screen.getByText('Assessment due for 2 days')
    expect(dueTagElement).toBeInTheDocument()
  })

  test('does not render "Due" tag when daysSinceAssessmentDue is undefined', () => {
    render(<StudyList {...defaultProps} daysSinceAssessmentDue={null} />)

    // Check if the "Due" tag is not rendered
    const dueTagElement = screen.queryByText('Due')
    expect(dueTagElement).toBeNull()
  })

  test('renders correct "Data updates required" tag when indications conatins only included values', () => {
    render(<StudyList {...defaultProps} indications={['Recruitment target met']} />)

    // Check if the "Data updates required" tag is rendered
    const dataUpdatesRequiredTagElement = screen.getByText('Data updates required')
    expect(dataUpdatesRequiredTagElement).toBeInTheDocument()
  })

  test('renders correct "Data updates required" tag when indications conatins included and excluded values', () => {
    render(<StudyList {...defaultProps} indications={['Recruitment target met', 'No recruitment for 6 months']} />)

    // Check if the "Data updates required" tag is rendered
    const dataUpdatesRequiredTagElement = screen.getByText('Data updates required')
    expect(dataUpdatesRequiredTagElement).toBeInTheDocument()
  })

  test('does not render "Data updates required" tag when indications conatins only excluded values', () => {
    render(<StudyList {...defaultProps} indications={['Recruiting at a lower rate than expected (RTT)', 'No recruitment in past 6 months']} />)

    // Check if the "Data updates required" tag is not rendered
    const dataUpdatesRequiredTagElement = screen.queryByText('Due')
    expect(dataUpdatesRequiredTagElement).toBeNull()
  })

  test('renders correct "Needs action" tag when data updates required', () => {
    render(<StudyList {...defaultProps} indications={['Recruitment target met', 'No recruitment for 6 months']} />)

    // Check if the "Needs action" tag is rendered
    const needsActionTagElement = screen.getByText('Needs action')
    expect(needsActionTagElement).toBeInTheDocument()
  })

  test('renders correct "Needs action" tag when when daysSinceAssessmentDue is greater than 1', () => {
    render(<StudyList {...defaultProps} daysSinceAssessmentDue={2} />)

    // Check if the "Needs action" tag is rendered
    const needsActionTagElement = screen.getByText('Needs action')
    expect(needsActionTagElement).toBeInTheDocument()
  })

  test('renders correct "Needs action" tag when when daysSinceAssessmentDue is greater than 1 and Data updates required', () => {
    render(<StudyList {...defaultProps} daysSinceAssessmentDue={2} indications={['No recruitment for 6 months']}  />)

    // Check if the "Needs action" tag is rendered
    const needsActionTagElement = screen.getByText('Needs action')
    expect(needsActionTagElement).toBeInTheDocument()
  })

  test('does not render "Needs action" tag when when daysSinceAssessmentDue is undefined and Data updates are not required', () => {
    render(<StudyList {...defaultProps} daysSinceAssessmentDue={null} indications={['No recruitment in past 6 months']}  />)

    // Check if the "Needs action" tag is rendered
    const needsActionTagElement = screen.queryByText('Needs action')
    expect(needsActionTagElement).toBeNull()
  })

  test('renders with different sponsorName, irasId and shortTitle', () => {
    const props: StudyListProps = {
      ...defaultProps,
      sponsorOrgName: 'New Sponsor',
      shortTitle: 'New Study',
      irasId: '31833',
    }
    render(<StudyList {...props} />)

    // Check if the updated sponsorName and shortTitle are present
    const sponsorNameElement = screen.getByText('New Sponsor')
    const shortTitleElement = screen.getByText('New Study')
    const iradIdElement = screen.getByText('IRAS ID: 31833')

    expect(sponsorNameElement).toBeInTheDocument()
    expect(shortTitleElement).toBeInTheDocument()
    expect(iradIdElement).toBeInTheDocument()
  })

  test('renders support organisation (i.e. CTU or CRO) name when provided', () => {
    const props: StudyListProps = {
      ...defaultProps,
      supportOrgName: 'Support Org ABC',
    }
    render(<StudyList {...props} />)

    expect(screen.getByText('Sponsor ABC (Support Org ABC)')).toBeInTheDocument()
  })

  test.each(['', null])('displays "Not available" when irasId is a falsy value', (irasId: string | null) => {
    render(<StudyList {...defaultProps} irasId={irasId} />)

    const irasIdElement = screen.getByText('IRAS ID: Not available')
    expect(irasIdElement).toBeInTheDocument()
  })
})
