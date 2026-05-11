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

export default withApiHandler<ExtendedNextApiRequest>(
  [Roles.SponsorContact],
  async (req, res) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).end('Method Not Allowed')
    }

    try {
      const parsed = configureSchema.parse(req.body)
      const { studyId, status, noReason } = parsed

      const updatedStudy = await prismaClient.study.update({
        where: { id: Number(studyId) },
        data: {
          willRecruitWithinTimeline: status === 'true',
          reasonNotRecruitingWithinTimeline: noReason,
          updatedAt: new Date(),
        },
      })

      logger.info(`Updated study with id: ${updatedStudy.id}`)

      const returnUrl = typeof req.query.returnUrl === 'string'
        ? req.query.returnUrl
        : ''

      return res.redirect(
        302,
        returnUrl.includes(studyId)
          ? `/studies/${studyId}?success=4`
          : `/studies?success=1`
      )
    } catch (error) {
      logger.error(error)

      if (error instanceof ZodError) {
        const searchParams = new URLSearchParams()

        for (const issue of error.errors) {
          const field = issue.path[0]
          if (typeof field === 'string') {
            searchParams.set(`${field}Error`, issue.message)
          }
        }

        // Echo values back safely (only strings)
        const body = req.body as Partial<Record<string, unknown>>
        for (const [key, value] of Object.entries(body)) {
          if (typeof value === 'string' && key !== 'studyId') {
            searchParams.set(key, value)
          }
        }

        if (typeof req.query.returnUrl === 'string') {
          searchParams.set('returnUrl', req.query.returnUrl)
        }

        const failedStudyId =
          typeof body.studyId === 'string' ? body.studyId : ''

        return res.redirect(
          302,
          `${getConfigurePageRoute(failedStudyId)}/?${searchParams.toString()}`
        )
      }

      const fatalParams = new URLSearchParams({ fatal: '1' })
      if (typeof req.query.returnUrl === 'string') {
        fatalParams.set('returnUrl', req.query.returnUrl)
      }

      return res.redirect(
        302,
        `${getConfigurePageRoute('')}/?${fatalParams.toString()}`
      )
    }
  }
)