import { Table } from '@nihr-ui/frontend'
import type { getStudyById } from '@/lib/studies'

export interface StudyDetailsProps {
  study: NonNullable<Awaited<ReturnType<typeof getStudyById>>['data']>
}

export function StudyDetails({ study }: StudyDetailsProps) {
  return (
    <Table className="govuk-!-margin-bottom-3">
      <Table.Caption className="govuk-visually-hidden">About this study</Table.Caption>
      <Table.Body>
        <Table.Row>
          <Table.CellHeader className="w-1/3">Study full title</Table.CellHeader>
          <Table.Cell>{study.title}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader className="w-1/3">Protocol reference number</Table.CellHeader>
          <Table.Cell>{study.protocolReferenceNumber ?? 'None available'}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader className="w-1/3">IRAS ID</Table.CellHeader>
          <Table.Cell>{study.irasId ?? 'None available'}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader className="w-1/3">CPMS ID</Table.CellHeader>
          <Table.Cell>{study.cpmsId}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader className="w-1/3">Sponsor</Table.CellHeader>
          <Table.Cell>{study.organisationsByRole.Sponsor}</Table.Cell>
        </Table.Row>
        {study.organisationsByRole.CTU ? (
          <Table.Row>
            <Table.CellHeader className="w-1/3">CTU</Table.CellHeader>
            <Table.Cell>{study.organisationsByRole.CTU}</Table.Cell>
          </Table.Row>
        ) : null}
        {study.organisationsByRole.CRO ? (
          <Table.Row>
            <Table.CellHeader className="w-1/3">CRO</Table.CellHeader>
            <Table.Cell>{study.organisationsByRole.CRO}</Table.Cell>
          </Table.Row>
        ) : null}
        <Table.Row>
          <Table.CellHeader className="w-1/3">Managing specialty</Table.CellHeader>
          <Table.Cell>{study.managingSpeciality}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader className="w-1/3">Chief investigator</Table.CellHeader>
          <Table.Cell>
            {study.chiefInvestigatorFirstName
              ? `${study.chiefInvestigatorFirstName} ${study.chiefInvestigatorLastName}`
              : 'None available'}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  )
}
