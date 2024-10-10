import { fieldNameToLabelMapping } from '@/constants/editStudyForm'

export const getColumnChangedLabelText = (key: string): string => {
  const mappings: Record<string, string> = {
    UkRecruitmentTarget: fieldNameToLabelMapping.recruitmentTarget,
    StudyStatus: fieldNameToLabelMapping.status,
    PlannedOpeningDate: fieldNameToLabelMapping.plannedOpeningDate,
    ActualOpeningDate: fieldNameToLabelMapping.actualOpeningDate,
    PlannedClosureToRecruitmentDate: fieldNameToLabelMapping.plannedClosureDate,
    ActualClosureToRecruitmentDate: fieldNameToLabelMapping.actualClosureDate,
    EstimatedReopeningDate: fieldNameToLabelMapping.estimatedReopeningDate,
  }

  return mappings[key] || key
}
