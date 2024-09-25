import { Container, NotificationBanner, Table } from '@nihr-ui/frontend'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import type { ReactElement } from 'react'

import {
  AssessmentHistory,
  EditHistory,
  getAssessmentHistoryFromStudy,
  RequestSupport,
  StudyDetails,
} from '@/components/molecules'
import { RootLayout } from '@/components/organisms'
import { EDIT_STUDY_ROLE, Roles } from '@/constants'
import { FORM_SUCCESS_MESSAGES } from '@/constants/forms'
import { ASSESSMENT_PAGE, STUDIES_PAGE, SUPPORT_PAGE } from '@/constants/routes'
import { getStudyByIdFromCPMS } from '@/lib/cpms/studies'
import {
  getStudyById,
  mapCPMSStudyEvalToSEEval,
  mapCPMSStudyToSEStudy,
  updateEvaluationCategories,
  updateStudy,
} from '@/lib/studies'
import { formatDate } from '@/utils/date'
import { withServerSideProps } from '@/utils/withServerSideProps'

const renderNotificationBanner = (success: string | undefined, showRequestSupportLink: boolean) =>
  success || !Number.isNaN(Number(success)) ? (
    <NotificationBanner heading={FORM_SUCCESS_MESSAGES[Number(success)]} success>
      {showRequestSupportLink ? (
        <>
          Request{' '}
          <Link className="govuk-notification-banner__link" href={SUPPORT_PAGE}>
            NIHR RDN support
          </Link>{' '}
          for this study.
        </>
      ) : null}
    </NotificationBanner>
  ) : null

const renderBackLink = () => (
  <div className="ml-8 govuk-!-padding-top-3">
    <Container>
      <Link className="govuk-back-link govuk-!-font-size-19 font-light" href="/studies">
        All studies
      </Link>
    </Container>
  </div>
)

export type StudyProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Study({ user, study, studyInCPMS, assessments }: StudyProps) {
  const router = useRouter()
  const successType = router.query.success as string
  const { organisationsByRole } = study

  const supportOrgName = organisationsByRole.CRO ?? organisationsByRole.CTU

  const showEditStudyFeature = Boolean(user?.groups.includes(EDIT_STUDY_ROLE))

  const showEditHistoryFeature = process.env.NEXT_PUBLIC_ENABLE_EDIT_HISTORY_FEATURE?.toLowerCase() === 'true'

  return (
    <Container>
      <NextSeo title={`Study Progress Review - ${studyInCPMS.StudyShortName}`} />
      <div className="lg:flex lg:gap-6">
        <div className="w-full">
          {renderNotificationBanner(successType, successType === '1')}

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
          {showEditHistoryFeature ? <EditHistory /> : null}
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
                  {studyInCPMS.StudyEvaluationCategories.length
                    ? studyInCPMS.StudyEvaluationCategories.map(
                        (evalCategory) => evalCategory.EvaluationCategoryValue
                      ).join(', ')
                    : 'This study is progressing as planned'}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Planned opening date</Table.CellHeader>
                <Table.Cell>
                  {studyInCPMS.PlannedOpeningDate ? formatDate(studyInCPMS.PlannedOpeningDate) : '-'}
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
                  {studyInCPMS.ActualClosureToRecruitmentDate
                    ? formatDate(studyInCPMS.ActualClosureToRecruitmentDate)
                    : '-'}
                </Table.Cell>
              </Table.Row>
              {studyInCPMS.StudyStatus === 'Suspended' && Boolean(studyInCPMS.StudyEvaluationCategories.length) && (
                <Table.Row>
                  <Table.CellHeader className="w-1/3">Estimated reopening date</Table.CellHeader>
                  <Table.Cell>
                    {studyInCPMS.StudyEvaluationCategories[0]?.ExpectedReopenDate
                      ? formatDate(studyInCPMS.StudyEvaluationCategories[0].ExpectedReopenDate)
                      : '-'}
                  </Table.Cell>
                </Table.Row>
              )}

              <Table.Row>
                <Table.CellHeader className="w-1/3" data-testid="uk-recruitment-target-label">
                  {studyInCPMS.StudyRoute === 'Commercial'
                    ? 'UK recruitment target (excluding private sites)'
                    : 'UK recruitment target'}
                </Table.CellHeader>
                <Table.Cell>{studyInCPMS.SampleSize ?? '-'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3" data-testid="total-uk-recruitment-label">
                  {studyInCPMS.StudyRoute === 'Commercial'
                    ? 'Total UK recruitment to date (excluding private sites)'
                    : 'Total UK recruitment to date'}
                </Table.CellHeader>
                <Table.Cell>{studyInCPMS.TotalRecruitmentToDate ?? '-'}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          {/* Sponsor assessment history */}
          <AssessmentHistory assessments={assessments} firstItemExpanded heading="Sponsor assessment history" />

          {/* About this study */}
          <h3 className="govuk-heading-m govuk-!-margin-bottom-3">About this study</h3>
          <StudyDetails study={study} studyInCPMS={studyInCPMS} />
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

  const { data: updatedStudy } = await updateStudy(study.cpmsId, mapCPMSStudyToSEStudy(studyInCPMS))

  if (!updatedStudy) {
    return {
      redirect: {
        destination: '/500',
      },
    }
  }

  const studyEvalsInCPMS = studyInCPMS.StudyEvaluationCategories
  const currentStudyEvalsInSE = updatedStudy.evaluationCategories

  // Soft delete evaluations in SE that are no longer returned from CPMS
  const studyEvalIdsToDelete = currentStudyEvalsInSE
    .filter(
      (seEval) =>
        !studyEvalsInCPMS.some(({ EvaluationCategoryValue }) => EvaluationCategoryValue === seEval.indicatorValue)
    )
    .map(({ id }) => id)

  const mappedStudyEvalsInCPMS = studyEvalsInCPMS.map((studyEval) => mapCPMSStudyEvalToSEEval(studyEval))
  const { data: updatedStudyEvals } = await updateEvaluationCategories(
    study.id,
    mappedStudyEvalsInCPMS,
    studyEvalIdsToDelete
  )

  if (!updatedStudyEvals) {
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
      study: { ...study, evaluationCategories: updatedStudyEvals },
      studyInCPMS,
    },
  }
})
