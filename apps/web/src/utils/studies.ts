import { setStudyAssessmentDueDate, setStudyAssessmentNotDue } from '@/lib/studies'

export const getStudyAssessmentDueDate = async (studyId: number, currentAssessmentDueDate: Date | null) => {
  const { data: studyAssessmentNotDueResponse } = await setStudyAssessmentNotDue([studyId])

  if (studyAssessmentNotDueResponse === null) {
    return currentAssessmentDueDate
  }

  if (studyAssessmentNotDueResponse > 0) {
    // Not due for an assessment
    return null
  }

  // Assessment should be due for an assessment
  const { data: studyAssessmentDueResponse } = await setStudyAssessmentDueDate([studyId])

  if (studyAssessmentDueResponse === null) {
    return currentAssessmentDueDate
  }

  // If there is already a date set, `setStudyAssessmentDueDate` will return 0 as no update was done.
  if (studyAssessmentDueResponse === 0) {
    if (currentAssessmentDueDate) {
      return currentAssessmentDueDate
    }
  }

  return new Date()
}
