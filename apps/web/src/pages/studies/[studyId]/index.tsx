import { Container, NotificationBanner, Table } from '@nihr-ui/frontend'
import { logger } from '@nihr-ui/logger'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import type { ReactElement } from 'react'
import type { LeadAdministrationId } from 'shared-utilities/src/utils/lead-administration-id'

import { Status } from '@/@types/studies'
import type { SummaryCardProps } from '@/components/atoms/SummaryCard/SummaryCard'
import {
  AssessmentHistory,
  EditHistory,
  getAssessmentHistoryFromStudy,
  RequestSupport,
  StudyDetails,
  StudyProgressExtended,
} from '@/components/molecules'
import { ReportFirst } from '@/components/molecules/cards/ReportFirst/ReportFirst'
import { getEditHistory } from '@/components/molecules/EditHistory/utils'
import SummaryCardCollection from '@/components/molecules/SummaryCollection/SummaryCardCollection'
import SummaryList from '@/components/molecules/SummaryList/SummaryList'
import { RootLayout } from '@/components/organisms'
import { Roles } from '@/constants'
import { ContentfulPage } from '@/constants/contentful/pages'
import { FormStudyStatus } from '@/constants/editStudyForm'
import { FORM_SUCCESS_MESSAGES } from '@/constants/forms'
import { getAssessmentPageRoute, STUDIES_PAGE, SUPPORT_PAGE } from '@/constants/routes'
import { getSetPageByKey } from '@/lib/contentful/contentfulService'
import { getStudyByIdFromCPMS } from '@/lib/cpms/studies'
import type { StudyEvalsWithoutGeneratedValues } from '@/lib/studies'
import {
  buildSummaryRows,
  getAssessmentDueIndicator,
  getDaysSinceAssessmentDue,
  getStudyById,
  mapCPMSStatusToFormStatus,
  mapCPMSStudyEvalToSEEval,
  mapCPMSStudyToSEStudy,
  updateEvaluationCategories,
  updateStudy,
} from '@/lib/studies'
import { formatDate } from '@/utils/date'
import { getStudyAssessmentDueDate } from '@/utils/studies'
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

export default function Study({ study, assessments, editHistory, getEditHistoryError, progressBarPageContent }: StudyProps) {
  const router = useRouter()
  const successType = router.query.success as string
  const transactionIdLatestProposedUpdate = router.query.latestProposedUpdate as string | undefined
  const { organisationsByRole } = study

  const supportOrgName = organisationsByRole.CRO ?? organisationsByRole.CTU

  const isStudyStatusSuspended = (
    [Status.Suspended, Status.SuspendedFromOpenToRecruitment, Status.SuspendedFromOpenWithRecruitment] as string[]
  ).includes(study.studyStatus)

  const formStatus = mapCPMSStatusToFormStatus(study.studyStatus) as FormStudyStatus

  const panelsByStatus: Partial<Record<FormStudyStatus, SummaryCardProps[]>> = {
    [FormStudyStatus.Suspended]: [
      {
        title: 'Study status',
        content: formStatus,
      },
      {
        title: 'Recruitment total',
        content: study.totalRecruitmentToDate?.toString() ?? '-',
      },
      {
        title: 'Estimated reopening date',
        content: study.estimatedReopeningDate?.toLocaleDateString('en-GB') ?? '-',
      },
    ],

    [FormStudyStatus.InSetup]: [
      {
        title: 'Study status',
        content: formStatus,
      },
      {
        title: 'Planned UK target',
        content: study.sampleSize?.toString() ?? '-',
      },
      {
        title: 'Planned open to recruitment date',
        content: study.plannedOpeningDate?.toLocaleDateString('en-GB') ?? '-',
      },
    ],

    [FormStudyStatus.OpenToRecruitment]: [
      {
        title: 'Study status',
        content: formStatus,
      },
      {
        title: 'Recruitment numbers',
        content:
          study.totalRecruitmentToDate !== null && study.sampleSize !== null
            ? `${study.totalRecruitmentToDate} of ${study.sampleSize}`
            : '-',
      },
      {
        title: 'Planned closure date',
        content: study.plannedClosureDate?.toLocaleDateString('en-GB') ?? '-',
      },
    ],
  }

  const panels = panelsByStatus[formStatus] ?? []
  
  const indicators: string[] = [
    getAssessmentDueIndicator(
      study.dueAssessmentAt !== null,
      getDaysSinceAssessmentDue(study.dueAssessmentAt),
    ),

    ...study.evaluationCategories.map(
      (ec) => ec.indicatorValue
    ),
  ].filter(Boolean) as string[];

  const indicatorSummaryRows = buildSummaryRows(indicators, `${STUDIES_PAGE}/${study.id}`);

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

          <SummaryCardCollection panels={panels} />

          <div className="flex flex-col govuk-!-margin-bottom-4 govuk-!-margin-top-4 gap-6">

            {indicatorSummaryRows.length > 0 && (
              <>
                <h3 className="govuk-heading-m govuk-!-margin-bottom-0">
                  Actions needed
                </h3>
                <SummaryList className='summary-list--study-indicators govuk-!-margin-bottom-0' rows={indicatorSummaryRows} />
              </>
            )}

            <div className="flex gap-4">
              <Link className="govuk-button w-auto govuk-!-margin-bottom-0" href={getAssessmentPageRoute(study.id)}>
                Assess study
              </Link>
              <Link
                className="govuk-button govuk-button--secondary w-auto govuk-!-margin-bottom-0"
                href={`${STUDIES_PAGE}/${study.id}/edit`}
              >
                Update study data
              </Link>
            </div>

            <StudyProgressExtended
              hraApprovalDate={study.hraApprovalDate}
              moreDetailsHref={`${STUDIES_PAGE}/${study.id}/configure`}
              progressBarPageContent={progressBarPageContent}
              studyStatus={study.studyStatus}
              willRecruitWithinTimeline={study.willRecruitWithinTimeline}
            />

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
            leadAdministrationId={study.leadAdministrationId as LeadAdministrationId}
          />

          <Table className="govuk-!-margin-top-3">
            <Table.Caption className="govuk-visually-hidden">Summary of study’s progress (UK)</Table.Caption>
            <Table.Body>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Study Status</Table.CellHeader>
                <Table.Cell>{formStatus}</Table.Cell>
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
          <ReportFirst showAsStartButton studyId={study.id} />
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
  
  const progressBarPageContent = await getSetPageByKey(ContentfulPage.PROGRESS_BAR)

  const changeHistoryFromDate = process.env.EDIT_HISTORY_START_DATE ?? ''
  const { study: studyInCPMS } = await getStudyByIdFromCPMS(study.cpmsId, changeHistoryFromDate)

  if (!studyInCPMS) {
    return {
      props: {
        user: session.user,
        assessments: getAssessmentHistoryFromStudy(study),
        study,
        progressBarPageContent,
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
        progressBarPageContent,
      },
    }
  }

  const currentDueAssessmentAt = study.dueAssessmentAt
  const dueAssessmentAt = await getStudyAssessmentDueDate(study.id, currentDueAssessmentAt)

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
        dueAssessmentAt,
      },
      editHistory,
      getEditHistoryError,
      progressBarPageContent,
    },
  }
})
