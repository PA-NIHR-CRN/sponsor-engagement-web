import { fieldNameToLabelMapping } from '@/constants/editStudyForm'

export const getColumnChangedLabelText = (key: string): string => {
  const mappings: Record<string, string> = {
    UkRecruitmentSampleSize: fieldNameToLabelMapping.recruitmentTarget,
    ukRecruitmentTarget: fieldNameToLabelMapping.recruitmentTarget,
    StudyStatus: fieldNameToLabelMapping.status,
    PlannedOpeningDate: fieldNameToLabelMapping.plannedOpeningDate,
    ActualOpeningDate: fieldNameToLabelMapping.actualOpeningDate,
    PlannedClosureToRecruitmentDate: fieldNameToLabelMapping.plannedClosureDate,
    ActualClosureToRecruitmentDate: fieldNameToLabelMapping.actualClosureDate,
    EstimatedReopeningDate: fieldNameToLabelMapping.estimatedReopeningDate,
    PlannedRecruitmentStartDate: fieldNameToLabelMapping.plannedOpeningDate,
    PlannedRecruitmentEndDate: fieldNameToLabelMapping.plannedClosureDate,
    studyStatusGroup: fieldNameToLabelMapping.status,
    actualClosureToRecruitmentDate: fieldNameToLabelMapping.actualClosureDate,
    plannedOpenngDate: fieldNameToLabelMapping.plannedOpeningDate,
    actualOpeningDate: fieldNameToLabelMapping.actualOpeningDate,
    plannedClosureToRecruitmentDate: fieldNameToLabelMapping.plannedClosureDate,
    estimatedReopeningDate: fieldNameToLabelMapping.estimatedReopeningDate,
    plannedOpeningDate: fieldNameToLabelMapping.plannedOpeningDate,
  }

  return mappings[key] || key
}
