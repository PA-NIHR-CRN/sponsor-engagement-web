import { Container, NotificationBanner, Table } from '@nihr-ui/frontend'
import { logger } from '@nihr-ui/logger'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import type { ReactElement } from 'react'

import { Status } from '@/@types/studies'
import {
  AssessmentHistory,
  EditHistory,
  getAssessmentHistoryFromStudy,
  RequestSupport,
  StudyDetails,
} from '@/components/molecules'
import { getEditHistory } from '@/components/molecules/EditHistory/utils'
import { RootLayout } from '@/components/organisms'
import { Roles } from '@/constants'
import { FORM_SUCCESS_MESSAGES } from '@/constants/forms'
import { ASSESSMENT_PAGE, STUDIES_PAGE, SUPPORT_PAGE } from '@/constants/routes'
import { getStudyByIdFromCPMS } from '@/lib/cpms/studies'
import type { StudyEvalsWithoutGeneratedValues } from '@/lib/studies'
import {
  getStudyById,
  mapCPMSStatusToFormStatus,
  mapCPMSStudyEvalToSEEval,
  mapCPMSStudyToSEStudy,
  setStudyAssessmentDueFlag,
  updateEvaluationCategories,
  updateStudy,
} from '@/lib/studies'
import { formatDate } from '@/utils/date'
import { withServerSideProps } from '@/utils/withServerSideProps'

const renderNotificationBanner = (success: string | undefined, showRequestSupportLink: boolean) =>
  success || !Number.isNaN(Number(success)) ? (
    <NotificationBanner heading={FORM_SUCCESS_MESSAGES[Number(success)]} isRichText success>
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

export default function Study({ study, assessments, editHistory, getEditHistoryError }: StudyProps) {
  const router = useRouter()
  const successType = router.query.success as string
  const transactionIdLatestProposedUpdate = router.query.latestProposedUpdate as string | undefined
  const { organisationsByRole } = study

  const supportOrgName = organisationsByRole.CRO ?? organisationsByRole.CTU

  const isStudyStatusSuspended = (
    [Status.Suspended, Status.SuspendedFromOpenToRecruitment, Status.SuspendedFromOpenWithRecruitment] as string[]
  ).includes(study.studyStatus)

  return (
    <Container>
      <NextSeo title={`Study Progress Review - ${study.shortTitle}`} />
      <div className="lg:flex lg:gap-6">
        <div className="w-full">
          {renderNotificationBanner(successType, successType === '1')}

          <h2 className="govuk-heading-l govuk-!-margin-bottom-1">
            <span className="govuk-visually-hidden">Study short title: </span>
            {study.shortTitle}
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
              <Link
                className="govuk-button govuk-button--secondary w-auto govuk-!-margin-bottom-0"
                href={`${STUDIES_PAGE}/${study.id}/edit`}
              >
                Update study data
              </Link>
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

          <EditHistory
            editHistoryItems={editHistory ?? []}
            error={Boolean(getEditHistoryError)}
            idToAutoExpand={transactionIdLatestProposedUpdate}
          />

          <Table className="govuk-!-margin-top-3">
            <Table.Caption className="govuk-visually-hidden">Summary of study’s progress (UK)</Table.Caption>
            <Table.Body>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Study Status</Table.CellHeader>
                <Table.Cell>{mapCPMSStatusToFormStatus(study.studyStatus)}</Table.Cell>
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
                <Table.CellHeader className="w-1/3">Planned opening to recruitment date</Table.CellHeader>
                <Table.Cell>{study.plannedOpeningDate ? formatDate(study.plannedOpeningDate) : '-'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Actual opening to recruitment date</Table.CellHeader>
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
              {isStudyStatusSuspended ? (
                <Table.Row>
                  <Table.CellHeader className="w-1/3">Estimated reopening date</Table.CellHeader>
                  <Table.Cell>
                    {study.estimatedReopeningDate ? formatDate(study.estimatedReopeningDate) : '-'}
                  </Table.Cell>
                </Table.Row>
              ) : null}
              <Table.Row>
                <Table.CellHeader className="w-1/3" data-testid="uk-recruitment-target-label">
                  {study.route === 'Commercial'
                    ? 'UK recruitment target (excluding private sites)'
                    : 'UK recruitment target'}
                </Table.CellHeader>
                <Table.Cell>{study.sampleSize ?? '-'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3" data-testid="total-uk-recruitment-label">
                  {study.route === 'Commercial'
                    ? 'Total UK recruitment to date (excluding private sites)'
                    : 'Total UK recruitment to date'}
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

export const getServerSideProps = withServerSideProps([Roles.SponsorContact], async (context, session) => {
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

  logger.info('Successfully retrieved study from SE with studyId: %s', studyId)

  const changeHistoryFromDate = process.env.EDIT_HISTORY_START_DATE ?? ''
  const { study: studyInCPMS } = await getStudyByIdFromCPMS(study.cpmsId, changeHistoryFromDate)

  if (!studyInCPMS) {
    return {
      props: {
        user: session.user,
        assessments: getAssessmentHistoryFromStudy(study),
        study,
      },
    }
  }

  const studyEvalsInCPMS = studyInCPMS.StudyEvaluationCategories
  const mappedStudyEvalsInCPMS: StudyEvalsWithoutGeneratedValues[] = studyEvalsInCPMS.map((studyEval) =>
    mapCPMSStudyEvalToSEEval(studyEval)
  )

  const { data: updatedStudy } = await updateStudy(study.cpmsId, mapCPMSStudyToSEStudy(studyInCPMS))

  if (!updatedStudy) {
    return {
      props: {
        user: session.user,
        assessments: getAssessmentHistoryFromStudy(study),
        study,
      },
    }
  }

  const { data: setStudyAssessmentDueResponse } = await setStudyAssessmentDueFlag([studyId])
  const isStudyDueAssessment = setStudyAssessmentDueResponse !== null ? setStudyAssessmentDueResponse === 1 : false

  const currentStudyEvalsInSE = updatedStudy.evaluationCategories

  // Soft delete evaluations in SE that are no longer returned from CPMS
  const studyEvalIdsToDelete = currentStudyEvalsInSE
    .filter(
      (seEval) =>
        !studyEvalsInCPMS.some(({ EvaluationCategoryValue }) => EvaluationCategoryValue === seEval.indicatorValue)
    )
    .map(({ id }) => id)

  const { data: updatedStudyEvals } = await updateEvaluationCategories(
    study.id,
    mappedStudyEvalsInCPMS,
    studyEvalIdsToDelete
  )

  const { data: editHistory, error: getEditHistoryError } = await getEditHistory(studyId, studyInCPMS.ChangeHistory)

  return {
    props: {
      user: session.user,
      assessments: getAssessmentHistoryFromStudy(study),
      study: {
        ...updatedStudy,
        evaluationCategories: updatedStudyEvals ?? study.evaluationCategories,
        isDueAssessment: isStudyDueAssessment,
      },
      editHistory,
      getEditHistoryError,
    },
  }
})
