import { fieldNameToLabelMapping } from '@/constants/editStudyForm'

export const getColumnChangedLabelText = (key: string): string => {
  const mappings: Record<string, string> = {
    // CPMS fields
    UkRecruitmentSampleSize: fieldNameToLabelMapping.recruitmentTarget,
    StudyStatus: fieldNameToLabelMapping.status,
    PlannedOpeningDate: fieldNameToLabelMapping.plannedOpeningDate,
    ActualOpeningDate: fieldNameToLabelMapping.actualOpeningDate,
    PlannedClosureToRecruitmentDate: fieldNameToLabelMapping.plannedClosureDate,
    ActualClosureToRecruitmentDate: fieldNameToLabelMapping.actualClosureDate,
    EstimatedReopeningDate: fieldNameToLabelMapping.estimatedReopeningDate,
    PlannedRecruitmentStartDate: fieldNameToLabelMapping.plannedOpeningDate,
    PlannedRecruitmentEndDate: fieldNameToLabelMapping.plannedClosureDate,
    ActualClosureDate: fieldNameToLabelMapping.actualClosureDate,
    PlannedClosureDate: fieldNameToLabelMapping.plannedClosureDate,
    ExpectedReopenDate: fieldNameToLabelMapping.estimatedReopeningDate,
    // SE fields
    studyStatusGroup: fieldNameToLabelMapping.status,
    actualClosureToRecruitmentDate: fieldNameToLabelMapping.actualClosureDate,
    plannedOpeningDate: fieldNameToLabelMapping.plannedOpeningDate,
    actualOpeningDate: fieldNameToLabelMapping.actualOpeningDate,
    plannedClosureToRecruitmentDate: fieldNameToLabelMapping.plannedClosureDate,
    estimatedReopeningDate: fieldNameToLabelMapping.estimatedReopeningDate,
    ukRecruitmentTarget: fieldNameToLabelMapping.recruitmentTarget,
  }

  return mappings[key] || key
}
