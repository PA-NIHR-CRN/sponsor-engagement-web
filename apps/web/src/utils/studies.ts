import { setStudyAssessmentDueDate, setStudyAssessmentNotDue } from '@/lib/studies'

export const getStudyAssessmentDueDate = async (studyId: number, currentAssessmentDueDate: Date | null) => {
  const { data: setStudyAssessmentNotDueResponse } = await setStudyAssessmentNotDue([studyId])

  console.log('getStudyAssessmentDueDate', { setStudyAssessmentNotDueResponse })
  if (setStudyAssessmentNotDueResponse !== 0) {
    // Not due for an assessment
    return null
  }

  // Assessment should now be due for an assessment
  const { data: setStudyAssessmentDueResponse } = await setStudyAssessmentDueDate([studyId])

  console.log('getStudyAssessmentDueDate', { setStudyAssessmentDueResponse })

  // If there is already a date set, `setStudyAssessmentDueDate` will return 0 as no update was done.
  if (setStudyAssessmentDueResponse === 0) {
    if (currentAssessmentDueDate) {
      return currentAssessmentDueDate
    }
  }

  return new Date()
}
