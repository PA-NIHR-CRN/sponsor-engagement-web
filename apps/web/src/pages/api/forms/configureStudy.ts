//TODO: copy of apps/web/src/pages/api/forms/assessment.ts
import { logger } from '@nihr-ui/logger'
import type { NextApiRequest } from 'next'
import { ZodError } from 'zod'

import { Roles } from '@/constants'
import { getConfigurePageRoute } from '@/constants/routes'
import { prismaClient } from '@/lib/prisma'
import type { ConfigureInputs } from '@/utils/schemas'
import { configureSchema } from '@/utils/schemas'
import { withApiHandler } from '@/utils/withApiHandler'

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: ConfigureInputs
}

export default withApiHandler<ExtendedNextApiRequest>([Roles.SponsorContact], async (req, res, session) => {
  try {
    if (req.method !== 'POST') {
      throw new Error('Wrong method')
    }

    const { studyId, status} = configureSchema.parse(req.body)

    const studyResult = await prismaClient.study.update({
      where: {
        id: Number(studyId),
      },
      data: {
        willRecruitWithin90Days: status,
        updatedAt: new Date(),
        updatedById: session.user?.id,
      },
    })

    logger.info(`Updated study with id: ${studyResult.id}`)

    // Redirect back to study detail page
    if (String(req.query.returnUrl).includes(studyId)) {
      return res.redirect(302, `/studies/${studyId}?success=1`)
    }

    // Otherwise, redirect back to studies list page
    return res.redirect(302, `/studies?success=1`)
  } catch (error) {
    logger.error(error)

    const studyId = req.body.studyId

    if (error instanceof ZodError) {
      // Create an object containing the Zod validation errors
      const fieldErrors: Record<string, string> = Object.fromEntries(
        error.errors.map(({ path: [fieldId], message }) => [`${fieldId}Error`, message])
      )

      // Insert the original values
      Object.keys(configureSchema.shape).forEach((field) => {
        if (req.body[field]) {
          fieldErrors[field] = req.body[field] as string
        }
      })

      delete fieldErrors.studyId

      const searchParams = new URLSearchParams({
        ...fieldErrors,
      })
      if (req.query.returnUrl) searchParams.append('returnUrl', String(req.query.returnUrl))

      return res.redirect(302, `${getConfigurePageRoute(studyId)}/?${searchParams.toString()}`)
    }

    const searchParams = new URLSearchParams({
      fatal: '1',
    })
    if (req.query.returnUrl) searchParams.append('returnUrl', String(req.query.returnUrl))

    return res.redirect(302, `${getConfigurePageRoute(studyId)}/?${searchParams.toString()}`)
  }
})
