import { Container, NotificationBanner, Table } from '@nihr-ui/frontend'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import type { ReactElement } from 'react'

import { AssessmentHistory, getAssessmentHistoryFromStudy, RequestSupport, StudyDetails } from '@/components/molecules'
import { RootLayout } from '@/components/organisms'
import { EDIT_STUDY_ROLE, Roles } from '@/constants'
import { ASSESSMENT_PAGE, STUDIES_PAGE, SUPPORT_PAGE } from '@/constants/routes'
import { getStudyById, mapCPMSStudyToPrismaStudy, updateStudy } from '@/lib/studies'
import { formatDate } from '@/utils/date'
import { withServerSideProps } from '@/utils/withServerSideProps'
import { getStudyByIdFromCPMS } from '@/lib/cpms/studies'

const renderNotificationBanner = (success: boolean) =>
  success ? (
    <NotificationBanner heading="The study assessment was successfully saved" success>
      Request{' '}
      <Link className="govuk-notification-banner__link" href={SUPPORT_PAGE}>
        NIHR RDN support
      </Link>{' '}
      for this study.
    </NotificationBanner>
  ) : null

const renderBackLink = () => (
  <div className="ml-8 govuk-!-padding-top-3">
    <Container>
      <Link className="govuk-back-link" href="/studies">
        All studies
      </Link>
    </Container>
  </div>
)

export type StudyProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Study({ user, study, studyInCPMS, assessments }: StudyProps) {
  const router = useRouter()
  const { organisationsByRole } = study

  const supportOrgName = organisationsByRole.CRO ?? organisationsByRole.CTU

  const showEditStudyFeature = Boolean(user?.wso2Roles.includes(EDIT_STUDY_ROLE))

  return (
    <Container>
      <NextSeo title={`Study Progress Review - ${studyInCPMS.StudyShortName}`} />
      <div className="lg:flex lg:gap-6">
        <div className="w-full">
          {renderNotificationBanner(Boolean(router.query.success))}

          <h2 className="govuk-heading-l govuk-!-margin-bottom-1">
            <span className="govuk-visually-hidden">Study short title: </span>
            {studyInCPMS.StudyShortName}
          </h2>

          <span className="govuk-body-m mb-0 text-darkGrey">
            <span className="govuk-visually-hidden">Study sponsor: </span>
            {organisationsByRole.Sponsor}
            {Boolean(supportOrgName) && ` (${supportOrgName})`}
          </span>

          <div className="flex flex-col govuk-!-margin-bottom-4 govuk-!-margin-top-4 gap-6">
            {Boolean(study.isDueAssessment) && (
              <div>
                <span className="govuk-tag govuk-tag--red mr-2">Due</span>
                This study needs a new sponsor assessment.
              </div>
            )}
            <div className="flex gap-4">
              <Link className="govuk-button w-auto govuk-!-margin-bottom-0" href={`${ASSESSMENT_PAGE}/${study.id}`}>
                Assess study
              </Link>
              {showEditStudyFeature ? (
                <Link
                  className="govuk-button govuk-button--secondary w-auto govuk-!-margin-bottom-0"
                  href={`${STUDIES_PAGE}/${study.id}/edit`}
                >
                  Edit study data
                </Link>
              ) : null}
            </div>
          </div>

          <div className="govuk-inset-text mt-7">
            Check the study data and provide updates where necessary. Based on the summary, assess if your study is on
            or off track and what action you need to take.
          </div>

          {/* Summary of study’s progress (UK) */}
          <h3 className="govuk-heading-m govuk-!-margin-bottom-1 p-0">Summary of study’s progress (UK)</h3>
          <span className="govuk-body-s text-darkGrey">
            Based on the latest data uploaded to CPMS by the study team.
          </span>
          <Table className="govuk-!-margin-top-3">
            <Table.Caption className="govuk-visually-hidden">Summary of study’s progress (UK)</Table.Caption>
            <Table.Body>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Study Status</Table.CellHeader>
                <Table.Cell>{studyInCPMS.StudyStatus}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Study data indicates</Table.CellHeader>
                <Table.Cell>
                  {studyInCPMS.StudyEvaluations.length
                    ? studyInCPMS.StudyEvaluations.map((evalCategory) => evalCategory.indicatorValue).join(', ')
                    : 'This study is progressing as planned'}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Planned opening date</Table.CellHeader>
                <Table.Cell>
                  {studyInCPMS.PlannedClosureToRecruitmentDate ? formatDate(studyInCPMS.PlannedOpeningDate) : '-'}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Actual opening date</Table.CellHeader>
                <Table.Cell>
                  {studyInCPMS.ActualOpeningDate ? formatDate(studyInCPMS.ActualOpeningDate) : '-'}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Planned closure to recruitment date</Table.CellHeader>
                <Table.Cell>
                  {studyInCPMS.PlannedClosureToRecruitmentDate
                    ? formatDate(studyInCPMS.PlannedClosureToRecruitmentDate)
                    : '-'}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Actual closure to recruitment date</Table.CellHeader>
                <Table.Cell>
                  {studyInCPMS.ActualOpeningDate ? formatDate(studyInCPMS.ActualClosureToRecruitmentDate) : '-'}
                </Table.Cell>
              </Table.Row>
              {studyInCPMS.StudyStatus === 'Suspended' && Boolean(studyInCPMS.StudyEvaluations.length) && (
                <Table.Row>
                  <Table.CellHeader className="w-1/3">Estimated reopening date</Table.CellHeader>
                  <Table.Cell>
                    {studyInCPMS.StudyEvaluations[0].expectedReopenDate
                      ? formatDate(studyInCPMS.StudyEvaluations[0].expectedReopenDate)
                      : '-'}
                  </Table.Cell>
                </Table.Row>
              )}

              <Table.Row>
                <Table.CellHeader className="w-1/3">UK recruitment target (excluding private site)</Table.CellHeader>
                <Table.Cell>{studyInCPMS.UkRecruitmentTarget ?? '-'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Total UK recruitment to date</Table.CellHeader>
                <Table.Cell>{studyInCPMS.UkRecruitmentTargetToDate ?? '-'}</Table.Cell>
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
          <RequestSupport showCallToAction sticky />
        </div>
      </div>
    </Container>
  )
}

Study.getLayout = function getLayout(page: ReactElement, { user }: StudyProps) {
  return (
    <RootLayout backLink={renderBackLink()} user={user}>
      {page}
    </RootLayout>
  )
}

export const getServerSideProps = withServerSideProps(Roles.SponsorContact, async (context, session) => {
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

  const { study: studyInCPMS } = await getStudyByIdFromCPMS(study.cpmsId)

  if (!studyInCPMS) {
    return {
      redirect: {
        destination: '/500',
      },
    }
  }

  const { data: updatedStudy } = await updateStudy(study.cpmsId, mapCPMSStudyToPrismaStudy(studyInCPMS))

  if (!updatedStudy) {
    return {
      redirect: {
        destination: '/500',
      },
    }
  }

  return {
    props: {
      user: session.user,
      assessments: getAssessmentHistoryFromStudy(study),
      study,
      studyInCPMS,
    },
  }
})
