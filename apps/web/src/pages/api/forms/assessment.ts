import { logger } from '@nihr-ui/logger'
import type { Prisma } from 'database'
import type { NextApiRequest } from 'next'
import { ZodError, z } from 'zod'

import { Roles } from '@/constants'
import { getAssessmentPageRoute } from '@/constants/routes'
import { prismaClient } from '@/lib/prisma'
import { buildAssessmentSchema } from '@/utils/schemas'
import { withApiHandler } from '@/utils/withApiHandler'

const preSchema = z.object({
  studyId: z.union([z.string(), z.number()]).transform((v) => String(v)),
})

export default withApiHandler([Roles.SponsorContact], async (req, res, session) => {
  try {
    if (req.method !== 'POST') throw new Error('Wrong method')

    const { studyId } = preSchema.parse(req.body)

    const study = await prismaClient.study.findUnique({
      where: { id: Number(studyId) },
      select: {
        id: true,
        evaluationCategories: true,
      },
    })

    if (!study) {
      return res.redirect(302, `/404`)
    }

    const studyHasNotRecruitedWithinSixMonths = Boolean(
      study.evaluationCategories?.find(
        (indicator: any) => indicator.indicatorValue === 'No recruitment in past 6 months',
      ),
    )

    const schema = buildAssessmentSchema(studyHasNotRecruitedWithinSixMonths)

    const { status, furtherInformation, furtherInformationText, reasonForNoRecruitment } = schema.parse(req.body)

    const furtherInformationInputs: Prisma.AssessmentFurtherInformationUncheckedCreateWithoutAssessmentInput[] = []

    if (Array.isArray(furtherInformation)) {
      for (const id of furtherInformation) {
        furtherInformationInputs.push({ furtherInformationId: Number(id) })
      }
    }

    if (furtherInformationText) {
      furtherInformationInputs.push({ furtherInformationText })
    }

    const assessmentResult = await prismaClient.assessment.create({
      data: {
        createdById: session.user.id,
        studyId: Number(studyId),
        statusId: Number(status),
        reasonForNoRecruitment: reasonForNoRecruitment ?? null,
        furtherInformation: {
          createMany: { data: furtherInformationInputs },
        },
      },
    })

    logger.info(`Added assessment with id: ${assessmentResult.id}`)

    await prismaClient.study.update({
      where: { id: Number(studyId) },
      data: {
        dueAssessmentAt: null,
        lastAssessmentId: assessmentResult.id,
      },
    })

    if (String(req.query.returnUrl).includes(studyId)) {
      return res.redirect(302, `/studies/${studyId}?success=1`)
    }
    return res.redirect(302, `/studies?success=1`)
  } catch (error) {
    logger.error(error)

    const studyId = (req.body?.studyId ?? '') as string

    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = Object.fromEntries(
        error.errors.map(({ path: [fieldId], message }) => [`${String(fieldId)}Error`, message]),
      )

      const allowedFields = ['studyId', 'status', 'furtherInformation', 'furtherInformationText', 'reasonForNoRecruitment'] as const
      for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(req.body, field)) {
          fieldErrors[field] = Array.isArray(req.body[field]) ? req.body[field].join(',') : String(req.body[field] ?? '')
        }
      }

      delete fieldErrors.studyId

      const searchParams = new URLSearchParams(fieldErrors)
      if (req.query.returnUrl) searchParams.append('returnUrl', String(req.query.returnUrl))

      return res.redirect(302, `${getAssessmentPageRoute(studyId)}/?${searchParams.toString()}`)
    }

    const searchParams = new URLSearchParams({ fatal: '1' })
    if (req.query.returnUrl) searchParams.append('returnUrl', String(req.query.returnUrl))

    return res.redirect(302, `${getAssessmentPageRoute(studyId)}/?${searchParams.toString()}`)
  }
})
