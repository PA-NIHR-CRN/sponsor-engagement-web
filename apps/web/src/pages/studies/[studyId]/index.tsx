import type { ReactElement } from 'react'
import { Container, NotificationBanner, Table } from '@nihr-ui/frontend'
import type { InferGetServerSidePropsType } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { RootLayout } from '../../../components/Layout/RootLayout'
import {
  AssessmentHistory,
  GetSupport,
  StudyDetails,
  getAssessmentHistoryFromStudy,
} from '../../../components/molecules'
import { getStudyById } from '../../../lib/studies'
import { formatDate } from '../../../utils/date'
import { withServerSideProps } from '../../../utils/withServerSideProps'

const renderNotificationBanner = (success: boolean) =>
  success ? (
    <NotificationBanner heading="The study assessment was successfully saved" success>
      Get{' '}
      <Link className="govuk-notification-banner__link" href="/">
        NIHR CRN support
      </Link>{' '}
      for this study.
    </NotificationBanner>
  ) : null

export type StudyProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Study({ study, assessments }: StudyProps) {
  const router = useRouter()

  return (
    <Container>
      <NextSeo title={`Study Progress Review - ${study.shortTitle}`} />
      <div className="lg:flex lg:gap-6">
        <div className="w-full">
          {renderNotificationBanner(Boolean(router.query.success))}

          <h2 className="govuk-heading-l govuk-!-margin-bottom-1">
            <span className="govuk-visually-hidden">Study short title: </span>
            {study.shortTitle}
          </h2>

          <span className="govuk-body-m mb-0 text-darkGrey">
            <span className="govuk-visually-hidden">Study sponsor: </span>
            {study.organisations[0].organisation.name}
          </span>

          <div className="flex items-center govuk-!-margin-bottom-4 govuk-!-margin-top-4 gap-6">
            <Link className="govuk-button w-auto govuk-!-margin-bottom-0" href={`/assessments/${study.id}`}>
              Assess
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
                <Table.CellHeader className="w-1/3">Study Status</Table.CellHeader>
                <Table.Cell>{study.studyStatus}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Study data indicates</Table.CellHeader>
                <Table.Cell>
                  {study.evaluationCategories.length
                    ? study.evaluationCategories.map((evalCategory) => evalCategory.indicatorValue).join(', ')
                    : 'This study is progressing as planned'}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Planned opening date</Table.CellHeader>
                <Table.Cell>{study.plannedOpeningDate ? formatDate(study.plannedOpeningDate) : '-'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Actual opening date</Table.CellHeader>
                <Table.Cell>{study.actualOpeningDate ? formatDate(study.actualOpeningDate) : '-'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Planned closure to recruitment date</Table.CellHeader>
                <Table.Cell>{study.plannedClosureDate ? formatDate(study.plannedClosureDate) : '-'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Actual closure to recruitment date</Table.CellHeader>
                <Table.Cell>{study.actualClosureDate ? formatDate(study.actualClosureDate) : '-'}</Table.Cell>
              </Table.Row>
              {study.studyStatus === 'Suspended' && Boolean(study.evaluationCategories.length) && (
                <Table.Row>
                  <Table.CellHeader className="w-1/3">Estimated reopening date</Table.CellHeader>
                  <Table.Cell>
                    {study.evaluationCategories[0].expectedReopenDate
                      ? formatDate(study.evaluationCategories[0].expectedReopenDate)
                      : '-'}
                  </Table.Cell>
                </Table.Row>
              )}
              <Table.Row>
                <Table.CellHeader className="w-1/3">
                  {study.route === 'Commercial' ? 'Network' : 'UK'} recruitment target
                </Table.CellHeader>
                <Table.Cell>{study.sampleSize ?? '-'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">
                  Total {study.route === 'Commercial' ? 'network' : 'UK'} recruitment to date
                </Table.CellHeader>
                <Table.Cell>{study.totalRecruitmentToDate ?? '-'}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          {/* Sponsor assessment history */}
          <AssessmentHistory assessments={assessments} firstItemExpanded heading="Sponsor assessment history" />

          {/* About this study */}
          <h3 className="govuk-heading-m govuk-!-margin-bottom-3">About this study</h3>
          <StudyDetails study={study} />
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

export const getServerSideProps = withServerSideProps(async (context, session) => {
  const studyId = Number(context.query.studyId)

  if (!studyId) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }

  const userOrganisationIds = session.user?.organisations.map((userOrg) => userOrg.organisationId)

  const { data: study } = await getStudyById(studyId, userOrganisationIds)

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
      assessments: getAssessmentHistoryFromStudy(study),
      study,
    },
  }
})
