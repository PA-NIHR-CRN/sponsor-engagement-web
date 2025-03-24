import { setStudyAssessmentDueDate, setStudyAssessmentNotDue } from '@/lib/studies'

export const getStudyAssessmentDueDate = async (studyId: number, currentAssessmentDueDate: Date | null) => {
  const { data: setStudyAssessmentNotDueResponse } = await setStudyAssessmentNotDue([studyId])

  if (setStudyAssessmentNotDueResponse === null) {
    return currentAssessmentDueDate
  }

  if (setStudyAssessmentNotDueResponse !== 0) {
    // Not due for an assessment
    return null
  }

  // Assessment should be due for an assessment
  const { data: setStudyAssessmentDueResponse } = await setStudyAssessmentDueDate([studyId])

  if (setStudyAssessmentDueResponse === null) {
    return currentAssessmentDueDate
  }

  // If there is already a date set, `setStudyAssessmentDueDate` will return 0 as no update was done.
  if (setStudyAssessmentDueResponse === 0) {
    if (currentAssessmentDueDate) {
      return currentAssessmentDueDate
    }
  }

  return new Date()
}
