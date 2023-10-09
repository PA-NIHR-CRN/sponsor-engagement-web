import type { ReactElement } from 'react'
import { Container, Table } from '@nihr-ui/frontend'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getServerSession } from 'next-auth/next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { RootLayout } from '../../components/Layout/RootLayout'
import { authOptions } from '../api/auth/[...nextauth]'
import { SIGN_IN_PAGE } from '../../constants/routes'
import { GetSupport } from '../../components/molecules'
import { getStudyById } from '../../lib/studies'
import { formatDate } from '../../utils/date'

export type StudyProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Study({ study }: StudyProps) {
  return (
    <Container>
      <NextSeo title={`Study Progress Review - ${study.name}`} />
      <div className="lg:flex lg:gap-6">
        <div className="w-full">
          <h2 className="govuk-heading-l govuk-!-margin-bottom-1">{study.name}</h2>
          <span className="govuk-body-m mb-0 text-darkGrey" data-testid="organisation-name">
            {study.organisations[0].organisation.name}
          </span>

          <div className="flex items-center govuk-!-margin-bottom-4 govuk-!-margin-top-4 gap-6">
            <Link className="govuk-button w-auto govuk-!-margin-bottom-0" href={`/assessments/${study.id}`}>
              Assess study
            </Link>
            {Boolean(study.isDueAssessment) && (
              <div>
                <span className="govuk-tag govuk-tag--red mr-2">Due</span>
                This study needs a new sponsor assessment.
              </div>
            )}
          </div>

          <p>
            You can review the progress of this study at any time. You will need to assess if the study is on or off
            track and if any <Link href="/">NIHR CRN support</Link> is needed.
          </p>

          {/* Progress summary */}
          <h3 className="govuk-heading-m govuk-!-margin-bottom-1 p-0">Progress Summary</h3>
          <span className="govuk-body-s text-darkGrey">
            Based on the latest data uploaded to CPMS by the study team.
          </span>
          <Table className="govuk-!-margin-top-3">
            <Table.Caption className="govuk-visually-hidden">Progress summary</Table.Caption>
            <Table.Body>
              <Table.Row>
                <Table.CellHeader>Study Status</Table.CellHeader>
                <Table.Cell>{study.status}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader>Study data indicates</Table.CellHeader>
                <Table.Cell>
                  {study.evaluationCategories.length
                    ? study.evaluationCategories.map((evalCategory) => evalCategory.indicatorValue).join(', ')
                    : 'This study is progressing as planned'}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader>Planned opening date</Table.CellHeader>
                <Table.Cell>{study.plannedOpeningDate ? formatDate(study.plannedOpeningDate) : '-'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader>Actual opening date</Table.CellHeader>
                <Table.Cell>{study.actualOpeningDate ? formatDate(study.actualOpeningDate) : '-'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader>Planned closure date</Table.CellHeader>
                <Table.Cell>{study.plannedClosureDate ? formatDate(study.plannedClosureDate) : '-'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader>Actual closure date</Table.CellHeader>
                <Table.Cell>{study.actualClosureDate ? formatDate(study.actualClosureDate) : '-'}</Table.Cell>
              </Table.Row>
              {study.status === 'Suspended' && Boolean(study.evaluationCategories.length) && (
                <Table.Row>
                  <Table.CellHeader>Estimated reopening date</Table.CellHeader>
                  <Table.Cell>{formatDate(study.evaluationCategories[0].expectedReopenDate ?? '-')}</Table.Cell>
                </Table.Row>
              )}
              <Table.Row>
                <Table.CellHeader>
                  {study.route === 'Commercial' ? 'Network' : 'UK'} recruitment target
                </Table.CellHeader>
                <Table.Cell>{study.sampleSize ?? '-'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader>
                  Total {study.route === 'Commercial' ? 'network' : 'UK'} recruitment to date
                </Table.CellHeader>
                <Table.Cell>{study.evaluationCategories[0]?.totalRecruitmentToDate ?? '-'}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          {/* About this study */}
          <h3 className="govuk-heading-m govuk-!-margin-bottom-3">About this study</h3>
          <Table className="govuk-!-margin-bottom-3">
            <Table.Caption className="govuk-visually-hidden">About this study</Table.Caption>
            <Table.Body>
              <Table.Row>
                <Table.CellHeader>Study long title</Table.CellHeader>
                <Table.Cell>{study.name}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader>Study route</Table.CellHeader>
                <Table.Cell>{study.route}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader>Sponsor</Table.CellHeader>
                <Table.Cell>{study.organisations.map((org) => org.organisation.name).join(', ')}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader>Sponsor protocol</Table.CellHeader>
                <Table.Cell>{study.protocolReferenceNumber ?? '-'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader>IRAS ID</Table.CellHeader>
                <Table.Cell>{study.irasId ?? '-'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader>CPMS ID</Table.CellHeader>
                <Table.Cell>{study.cpmsId}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader>Managing specialty</Table.CellHeader>
                <Table.Cell>{study.managingSpeciality}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader>Chief investigator</Table.CellHeader>
                <Table.Cell>
                  {study.chiefInvestigatorFirstName
                    ? `${study.chiefInvestigatorFirstName} ${study.chiefInvestigatorLastName}`
                    : '-'}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          {/* Study funders */}
          <Table>
            <Table.Caption className="govuk-visually-hidden">Study funders</Table.Caption>
            <Table.Header className="bg-grey-50">
              <Table.Row>
                <Table.CellHeader className="border-b-0" column>
                  Funder
                </Table.CellHeader>
                <Table.CellHeader className="border-b-0" column>
                  Funding stream
                </Table.CellHeader>
                <Table.CellHeader className="border-b-0" column>
                  Grant code
                </Table.CellHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {study.funders.map((funder) => (
                <Table.Row key={funder.organisation.id}>
                  <Table.Cell>{funder.organisation.name}</Table.Cell>
                  <Table.Cell>{funder.fundingStreamName}</Table.Cell>
                  <Table.Cell>{funder.grantCode}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className="lg:min-w-[300px] lg:max-w-[300px]">
          <GetSupport />
        </div>
      </div>
    </Container>
  )
}

Study.getLayout = function getLayout(page: ReactElement, { user }: StudyProps) {
  return <RootLayout user={user}>{page}</RootLayout>
}

// TODO!: authenticate user can access study

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session?.user) {
      return {
        redirect: {
          destination: SIGN_IN_PAGE,
        },
      }
    }

    if (session.user.roles.length === 0) {
      return {
        redirect: {
          destination: '/',
        },
      }
    }

    const studyId = context.query.id

    if (!studyId) {
      return {
        redirect: {
          destination: '/404',
        },
      }
    }

    const study = await getStudyById(Number(studyId))

    if (!study) {
      return {
        redirect: {
          destination: '/404',
        },
      }
    }

    return {
      props: {
        user: session.user,
        study,
      },
    }
  } catch (error) {
    return {
      redirect: {
        destination: '/500',
      },
    }
  }
}
