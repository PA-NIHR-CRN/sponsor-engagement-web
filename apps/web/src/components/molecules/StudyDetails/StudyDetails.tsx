import { Table } from '@nihr-ui/frontend'
import type { Prisma } from '@prisma/client'

import type { getStudyByIdFromCPMS } from '@/lib/cpms/studies'
import type { getStudyById } from '@/lib/studies'

export interface StudyDetailsProps {
  study: Prisma.StudyGetPayload<undefined> &
    Pick<NonNullable<Awaited<ReturnType<typeof getStudyById>>['data']>, 'organisationsByRole'>
  studyInCPMS: Awaited<ReturnType<typeof getStudyByIdFromCPMS>>['study']
}

function normalizeStudyData(study: StudyDetailsProps['study'], studyInCPMS: StudyDetailsProps['studyInCPMS']) {
  const {
    title: studyTitle,
    protocolReferenceNumber: studyProtocol,
    irasId: studyIrasId,
    cpmsId: studyCpmsId,
    organisationsByRole: studyOrgs,
    managingSpeciality: studyManagingSpecialty,
    chiefInvestigatorFirstName: studyCIFirstName,
    chiefInvestigatorLastName: studyCILastName,
    route: studyRoute,
  } = study

  const {
    Title: cpmsTitle,
    ProtocolReferenceNumber: cpmsProtocol,
    IrasId: cpmsIrasId,
    StudyId: cpmsStudyId,
    organisationsByRole: cpmsOrgs,
    ManagingSpecialty: cpmsManagingSpecialty,
    ChiefInvestigatorFirstName: cpmsCIFirstName,
    ChiefInvestigatorLastName: cpmsCILastName,
    StudyRoute: cpmsRoute,
  } = studyInCPMS ?? {}

  let chiefInvestigator = 'None available'

  if (cpmsCIFirstName && cpmsCILastName) {
    chiefInvestigator = `${cpmsCIFirstName} ${cpmsCILastName}`
  } else if (studyCIFirstName && studyCILastName) {
    chiefInvestigator = `${studyCIFirstName} ${studyCILastName}`.trim()
  }
  return {
    title: cpmsTitle || studyTitle,
    protocolReferenceNumber: cpmsProtocol || studyProtocol,
    irasId: cpmsIrasId || studyIrasId,
    cpmsId: cpmsStudyId || studyCpmsId,
    organisationsByRole: cpmsOrgs || studyOrgs,
    managingSpecialty: cpmsManagingSpecialty || studyManagingSpecialty,
    chiefInvestigator,
    studyRoute: cpmsRoute || studyRoute,
  }
}

export function StudyDetails({ study, studyInCPMS }: StudyDetailsProps) {
  const normalizedStudyData = normalizeStudyData(study, studyInCPMS)

  return (
    <Table className="govuk-!-margin-bottom-3">
      <Table.Caption className="govuk-visually-hidden">About this study</Table.Caption>
      <Table.Body>
        <Table.Row>
          <Table.CellHeader className="w-1/3">Study full title</Table.CellHeader>
          <Table.Cell>{normalizedStudyData.title}</Table.Cell>
        </Table.Row>

        {normalizedStudyData.studyRoute === 'Commercial' && (
          <Table.Row>
            <Table.CellHeader className="w-1/3">Protocol reference number</Table.CellHeader>
            <Table.Cell>{normalizedStudyData.protocolReferenceNumber ?? 'None available'}</Table.Cell>
          </Table.Row>
        )}

        <Table.Row>
          <Table.CellHeader className="w-1/3">IRAS ID</Table.CellHeader>
          <Table.Cell>{normalizedStudyData.irasId ?? 'None available'}</Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.CellHeader className="w-1/3">CPMS ID</Table.CellHeader>
          <Table.Cell>{normalizedStudyData.cpmsId}</Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.CellHeader className="w-1/3">Sponsor</Table.CellHeader>
          <Table.Cell>{normalizedStudyData.organisationsByRole.Sponsor}</Table.Cell>
        </Table.Row>

        {normalizedStudyData.organisationsByRole.CTU ? (
          <Table.Row>
            <Table.CellHeader className="w-1/3">CTU</Table.CellHeader>
            <Table.Cell>{normalizedStudyData.organisationsByRole.CTU}</Table.Cell>
          </Table.Row>
        ) : null}

        {normalizedStudyData.organisationsByRole.CRO ? (
          <Table.Row>
            <Table.CellHeader className="w-1/3">CRO</Table.CellHeader>
            <Table.Cell>{normalizedStudyData.organisationsByRole.CRO}</Table.Cell>
          </Table.Row>
        ) : null}

        <Table.Row>
          <Table.CellHeader className="w-1/3">Managing specialty</Table.CellHeader>
          <Table.Cell>{normalizedStudyData.managingSpecialty}</Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.CellHeader className="w-1/3">Chief investigator</Table.CellHeader>
          <Table.Cell>{normalizedStudyData.chiefInvestigator}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  )
}
