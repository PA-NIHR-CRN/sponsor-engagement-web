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
import { getStudyByIdFromCPMS } from '@/lib/cpms/studies'
import type { StudyEvalsWithoutGeneratedValues } from '@/lib/studies'
import {
  getStudyById,
  mapCPMSStudyEvalToSEEval,
  mapCPMSStudyToSEStudy,
  updateEvaluationCategories,
  updateStudy,
} from '@/lib/studies'
import { formatDate } from '@/utils/date'
import { withServerSideProps } from '@/utils/withServerSideProps'

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
      <Link className="govuk-back-link govuk-!-font-size-19 font-light" href="/studies">
        All studies
      </Link>
    </Container>
  </div>
)

export type StudyProps = InferGetServerSidePropsType<typeof getServerSideProps>

const normaliseStudyData = (study: StudyProps['study'], studyInCPMS: StudyProps['studyInCPMS']) => {
  const cpmsStudyEvalCategories =
    studyInCPMS?.StudyEvaluationCategories && studyInCPMS.StudyEvaluationCategories.length > 0
      ? studyInCPMS.StudyEvaluationCategories.map((evalCategory) => evalCategory.EvaluationCategoryValue)
      : undefined

  const seStudyEvalCategories =
    study.evaluationCategories.length > 0
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- both types include this value
        study.evaluationCategories.map((evalCategory) => evalCategory.indicatorValue)
      : undefined
  return {
    shortTitle: studyInCPMS?.StudyShortName || study.shortTitle,
    studyStatus: studyInCPMS?.StudyStatus || study.studyStatus,
    studyRoute: studyInCPMS?.StudyRoute || study.route,
    evaluationCategoryValues: cpmsStudyEvalCategories ?? seStudyEvalCategories ?? [],
    expectedReopeningDate:
      studyInCPMS?.StudyEvaluationCategories[0]?.ExpectedReopenDate ?? study.evaluationCategories[0].expectedReopenDate,
    plannedOpeningDate: studyInCPMS?.PlannedOpeningDate ?? study.plannedOpeningDate,
    actualOpeningDate: studyInCPMS?.ActualOpeningDate ?? study.actualOpeningDate,
    actualClosureDate: studyInCPMS?.ActualClosureToRecruitmentDate ?? study.actualClosureDate,
    plannedClosureDate: studyInCPMS?.PlannedClosureToRecruitmentDate ?? study.plannedClosureDate,
    sampleSize: studyInCPMS?.SampleSize ?? study.sampleSize,
    totalRecruitmentToDate: studyInCPMS?.TotalRecruitmentToDate ?? study.totalRecruitmentToDate,
  }
}

export default function Study({ user, study, studyInCPMS, assessments }: StudyProps) {
  const router = useRouter()
  const { organisationsByRole } = study

  const supportOrgName = organisationsByRole.CRO ?? organisationsByRole.CTU

  const showEditStudyFeature = Boolean(user?.groups.includes(EDIT_STUDY_ROLE))

  const normalisedStudyData = normaliseStudyData(study, studyInCPMS)

  return (
    <Container>
      <NextSeo title={`Study Progress Review - ${normalisedStudyData.shortTitle}`} />
      <div className="lg:flex lg:gap-6">
        <div className="w-full">
          {renderNotificationBanner(Boolean(router.query.success))}

          <h2 className="govuk-heading-l govuk-!-margin-bottom-1">
            <span className="govuk-visually-hidden">Study short title: </span>
            {normalisedStudyData.shortTitle}
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
                <Table.Cell>{normalisedStudyData.studyStatus}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Study data indicates</Table.CellHeader>
                <Table.Cell>
                  {normalisedStudyData.evaluationCategoryValues.length
                    ? normalisedStudyData.evaluationCategoryValues.join(', ')
                    : 'This study is progressing as planned'}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Planned opening date</Table.CellHeader>
                <Table.Cell>
                  {normalisedStudyData.plannedOpeningDate ? formatDate(normalisedStudyData.plannedOpeningDate) : '-'}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Actual opening date</Table.CellHeader>
                <Table.Cell>
                  {normalisedStudyData.actualOpeningDate ? formatDate(normalisedStudyData.actualOpeningDate) : '-'}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Planned closure to recruitment date</Table.CellHeader>
                <Table.Cell>
                  {normalisedStudyData.plannedClosureDate ? formatDate(normalisedStudyData.plannedClosureDate) : '-'}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3">Actual closure to recruitment date</Table.CellHeader>
                <Table.Cell>
                  {normalisedStudyData.actualClosureDate ? formatDate(normalisedStudyData.actualClosureDate) : '-'}
                </Table.Cell>
              </Table.Row>
              {normalisedStudyData.studyStatus === 'Suspended' &&
                Boolean(normalisedStudyData.evaluationCategoryValues.length) && (
                  <Table.Row>
                    <Table.CellHeader className="w-1/3">Estimated reopening date</Table.CellHeader>
                    <Table.Cell>
                      {normalisedStudyData.expectedReopeningDate
                        ? formatDate(normalisedStudyData.expectedReopeningDate)
                        : '-'}
                    </Table.Cell>
                  </Table.Row>
                )}

              <Table.Row>
                <Table.CellHeader className="w-1/3" data-testid="uk-recruitment-target-label">
                  {normalisedStudyData.studyRoute === 'Commercial'
                    ? 'UK recruitment target (excluding private sites)'
                    : 'UK recruitment target'}
                </Table.CellHeader>
                <Table.Cell>{normalisedStudyData.sampleSize ?? '-'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.CellHeader className="w-1/3" data-testid="total-uk-recruitment-label">
                  {normalisedStudyData.studyRoute === 'Commercial'
                    ? 'Total UK recruitment to date (excluding private sites)'
                    : 'Total UK recruitment to date'}
                </Table.CellHeader>
                <Table.Cell>{normalisedStudyData.totalRecruitmentToDate ?? '-'}</Table.Cell>
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

  if (studyInCPMS) {
    const { data: updatedStudy } = await updateStudy(study.cpmsId, mapCPMSStudyToSEStudy(studyInCPMS))

    // If update to study fails, do not update study evals.
    if (updatedStudy) {
      const studyEvalsInCPMS = studyInCPMS.StudyEvaluationCategories
      const currentStudyEvalsInSE = updatedStudy.evaluationCategories

      // Soft delete evaluations in SE that are no longer returned from CPMS
      const studyEvalIdsToDelete = currentStudyEvalsInSE
        .filter(
          (seEval) =>
            !studyEvalsInCPMS.some(({ EvaluationCategoryValue }) => EvaluationCategoryValue === seEval.indicatorValue)
        )
        .map(({ id }) => id)

      const mappedStudyEvalsInCPMS: StudyEvalsWithoutGeneratedValues[] = studyEvalsInCPMS.map((studyEval) =>
        mapCPMSStudyEvalToSEEval(studyEval)
      )

      const { data: updatedStudyEvals } = await updateEvaluationCategories(
        study.id,
        mappedStudyEvalsInCPMS,
        studyEvalIdsToDelete
      )

      return {
        props: {
          user: session.user,
          assessments: getAssessmentHistoryFromStudy(study),
          study: { ...updatedStudy, evaluationCategories: updatedStudyEvals ?? mappedStudyEvalsInCPMS },
          studyInCPMS,
        },
      }
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
