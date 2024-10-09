import type { Study } from '@/@types/studies'
import { fieldNameToLabelMapping } from '@/constants/editStudyForm'

type EditStudyFieldKeys = Pick<
  Study,
  | 'StudyStatus'
  | 'PlannedOpeningDate'
  | 'ActualOpeningDate'
  | 'PlannedClosureToRecruitmentDate'
  | 'ActualClosureToRecruitmentDate'
  | 'EstimatedReopeningDate'
  | 'UkRecruitmentTarget'
>

export const getCPMSStudyFieldsLabelText = (key: string): string => {
  const mappings: Record<keyof EditStudyFieldKeys, string> = {
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
