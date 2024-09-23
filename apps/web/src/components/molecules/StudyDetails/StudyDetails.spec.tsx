import React from 'react'
import { Mock } from 'ts-mockery'

import { render, screen, within } from '@/config/TestUtils'
import { mockCPMSStudy } from '@/mocks/studies'

import type { StudyDetailsProps } from './StudyDetails'
import { StudyDetails } from './StudyDetails'

describe('StudyDetails Component', () => {
  const defaultProps: StudyDetailsProps = Mock.of<StudyDetailsProps>({
    study: {
      title: 'Study Title',
      protocolReferenceNumber: 'Protocol123',
      irasId: 'IRAS456',
      cpmsId: 12345,
      organisationsByRole: {
        Sponsor: 'Sponsor Org',
        CTU: 'CTU Org',
        CRO: 'CRO Org',
      },
      managingSpeciality: 'Specialty Name',
      chiefInvestigatorFirstName: 'John',
      chiefInvestigatorLastName: 'Doe',
    },
    studyInCPMS: mockCPMSStudy,
  })

  test('renders study details with default props', () => {
    render(<StudyDetails {...defaultProps} />)

    const table = screen.getByRole('table', { name: 'About this study' })
    expect(table).toBeInTheDocument()

    const aboutHeaders = within(table).getAllByRole('rowheader')
    expect(aboutHeaders.map((header) => header.textContent)).toEqual([
      'Study full title',
      'IRAS ID',
      'CPMS ID',
      'Sponsor',
      'CTU',
      'CRO',
      'Managing specialty',
      'Chief investigator',
    ])

    const aboutRows = within(table).getAllByRole('row')
    expect(aboutRows.map((row) => within(row).getByRole('cell').textContent)).toEqual([
      mockCPMSStudy.Title,
      mockCPMSStudy.IrasId.toString(),
      mockCPMSStudy.StudyId.toString(),
      'Sponsor Org',
      'CTU Org',
      'CRO Org',
      mockCPMSStudy.ManagingSpecialty,
      `${mockCPMSStudy.ChiefInvestigatorFirstName} ${mockCPMSStudy.ChiefInvestigatorLastName}`,
    ])
  })

  test('renders "None available" for missing data', () => {
    const props: StudyDetailsProps = Mock.of<StudyDetailsProps>({
      study: {
        title: 'Study Title',
        protocolReferenceNumber: null,
        irasId: null,
        cpmsId: 12345,
        organisationsByRole: {
          Sponsor: 'Sponsor Org',
        },
        managingSpeciality: 'Specialty Name',
        chiefInvestigatorFirstName: null,
        chiefInvestigatorLastName: null,
      },
      studyInCPMS: {},
    })

    render(<StudyDetails {...props} />)

    const table = screen.getByRole('table', { name: 'About this study' })
    expect(table).toBeInTheDocument()

    const aboutHeaders = within(table).getAllByRole('rowheader')
    expect(aboutHeaders.map((header) => header.textContent)).toEqual([
      'Study full title',
      'IRAS ID',
      'CPMS ID',
      'Sponsor',
      'Managing specialty',
      'Chief investigator',
    ])

    const aboutRows = within(table).getAllByRole('row')
    expect(aboutRows.map((row) => within(row).getByRole('cell').textContent)).toEqual([
      'Study Title',
      'None available',
      '12345',
      'Sponsor Org',
      'Specialty Name',
      'None available',
    ])
  })

  test('renders "Protocol reference number" for commercial studies only', () => {
    const props: StudyDetailsProps = Mock.of<StudyDetailsProps>({
      study: {
        title: 'Study Title',
        protocolReferenceNumber: '123',
        irasId: null,
        cpmsId: 12345,
        organisationsByRole: {
          Sponsor: 'Sponsor Org',
        },
        route: 'Commercial',
        managingSpeciality: 'Specialty Name',
        chiefInvestigatorFirstName: null,
        chiefInvestigatorLastName: null,
      },
      studyInCPMS: {},
    })

    render(<StudyDetails {...props} />)

    const table = screen.getByRole('table', { name: 'About this study' })
    expect(table).toBeInTheDocument()

    const aboutHeaders = within(table).getAllByRole('rowheader')
    expect(aboutHeaders.map((header) => header.textContent)).toEqual([
      'Study full title',
      'Protocol reference number',
      'IRAS ID',
      'CPMS ID',
      'Sponsor',
      'Managing specialty',
      'Chief investigator',
    ])

    const aboutRows = within(table).getAllByRole('row')
    expect(aboutRows.map((row) => within(row).getByRole('cell').textContent)).toEqual([
      'Study Title',
      '123',
      'None available',
      '12345',
      'Sponsor Org',
      'Specialty Name',
      'None available',
    ])
  })

  test('renders CTU and CRO when available', () => {
    const props: StudyDetailsProps = Mock.of<StudyDetailsProps>({
      study: {
        ...defaultProps.study,
        organisationsByRole: {
          CTU: 'CTU Org',
          CRO: 'CRO Org',
        },
      },
      studyInCPMS: {},
    })

    render(<StudyDetails {...props} />)

    expect(screen.getByRole('rowheader', { name: 'CTU' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'CRO' })).toBeInTheDocument()

    expect(screen.getByRole('cell', { name: 'CTU Org' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'CRO Org' })).toBeInTheDocument()
  })
})
