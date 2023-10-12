import type { NextApiRequest, NextApiResponse } from 'next'
import { ZodError } from 'zod'
import type { AssessmentInputs } from '../../../utils/schemas'
import { assessmentSchema } from '../../../utils/schemas'

interface ExtendedNextApiRequest extends NextApiRequest {
  body: AssessmentInputs
}

export default function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      throw new Error('Wrong method')
    }

    const { studyId } = assessmentSchema.parse(req.body)

    if (String(req.query.returnUrl).includes(studyId)) {
      return res.redirect(302, `/studies/${studyId}`)
    }
    return res.redirect(302, `/studies`)
  } catch (error) {
    const studyId = req.body.studyId

    if (error instanceof ZodError) {
      // Create an object containing the Zod validation errors
      const fieldErrors: Record<string, string> = Object.fromEntries(
        error.errors.map(({ path: [fieldId], message }) => [`${fieldId}Error`, message])
      )

      // Insert the original values
      Object.keys(assessmentSchema.shape).forEach((field) => {
        if (req.body[field]) {
          fieldErrors[field] = req.body[field] as string
        }
      })

      delete fieldErrors.studyId

      const searchParams = new URLSearchParams({
        ...fieldErrors,
        returnUrl: String(req.query.returnUrl),
      })

      return res.redirect(302, `/assessments/${studyId}/?${searchParams.toString()}`)
    }

    console.error(error)

    const searchParams = new URLSearchParams({
      fatal: '1',
      returnUrl: String(req.query.returnUrl),
    })

    return res.redirect(302, `/assessments/${studyId}/?${searchParams.toString()}`)
  }
}
