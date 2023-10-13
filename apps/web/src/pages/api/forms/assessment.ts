import type { NextApiRequest } from 'next'
import { ZodError } from 'zod'
import type { Prisma } from 'database'
import type { AssessmentInputs } from '../../../utils/schemas'
import { assessmentSchema } from '../../../utils/schemas'
import { prismaClient } from '../../../lib/prisma'
import { withApiHandler } from '../../../utils/withApiHandler'

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: AssessmentInputs
}

export default withApiHandler<ExtendedNextApiRequest>(async (req, res, session) => {
  try {
    if (req.method !== 'POST') {
      throw new Error('Wrong method')
    }

    const { studyId, status, furtherInformation, furtherInformationText } = assessmentSchema.parse(req.body)

    const furtherInformationInputs: Prisma.AssessmentFurtherInformationUncheckedCreateWithoutAssessmentInput[] = []

    // Create a furtherInformation record for each selected checkbox
    if (Array.isArray(furtherInformation)) {
      for (const id of furtherInformation) {
        furtherInformationInputs.push({
          furtherInformationId: Number(id),
        })
      }
    }

    // Create a record for the furtherInformation text field
    if (furtherInformationText) {
      furtherInformationInputs.push({
        furtherInformationText,
      })
    }

    const assessmentResult = await prismaClient.assessment.create({
      data: {
        createdById: session.user.id,
        studyId: Number(studyId),
        statusId: Number(status),
        furtherInformation: {
          createMany: {
            data: furtherInformationInputs,
          },
        },
      },
    })

    console.info(`Added assessment with id: ${assessmentResult.id}`)

    const studyResult = await prismaClient.study.update({
      where: {
        id: Number(studyId),
      },
      data: {
        isDueAssessment: false,
      },
    })

    console.info(`Updated study with id: ${studyResult.id}`)

    // Redirect back to study detail page
    if (String(req.query.returnUrl).includes(studyId)) {
      return res.redirect(302, `/studies/${studyId}?success=1`)
    }

    // Otherwise, redirect back to studies list page
    return res.redirect(302, `/studies?success=1`)
  } catch (error) {
    console.error(error)

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
      })
      if (req.query.returnUrl) searchParams.append('returnUrl', String(req.query.returnUrl))

      return res.redirect(302, `/assessments/${studyId}/?${searchParams.toString()}`)
    }

    const searchParams = new URLSearchParams({
      fatal: '1',
    })
    if (req.query.returnUrl) searchParams.append('returnUrl', String(req.query.returnUrl))

    return res.redirect(302, `/assessments/${studyId}/?${searchParams.toString()}`)
  }
})
