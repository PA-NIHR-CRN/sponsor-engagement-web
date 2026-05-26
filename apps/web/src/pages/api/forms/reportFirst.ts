import { logger } from '@nihr-ui/logger'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ZodError } from 'zod'

import { Roles } from '@/constants'
import { REPORT_FIRSTS_PAGE } from '@/constants/routes'
import { prismaClient } from '@/lib/prisma'
import { type ReportFirstInputs,reportFirstSchema } from '@/utils/schemas/reportFirst.schema'
import { withApiHandler } from '@/utils/withApiHandler'

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: ReportFirstInputs
}

const ALLOWED_METHOD = 'POST' as const
const CONFIRMATION_PATH = '/report-first/confirmation' as const

function isSafeReturnUrl(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
}

function datePartsToDate(firstAt: { day: string; month: string; year: string }) {
  const day = Number(firstAt.day)
  const month = Number(firstAt.month)
  const year = Number(firstAt.year)
  return new Date(year, month - 1, day)
}

function nullIfBlank(value: string | null | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function redirectToReportFirst(res: NextApiResponse, params: URLSearchParams) {
  return res.redirect(302, `${REPORT_FIRSTS_PAGE}?${params.toString()}`)
}

function buildValidationRedirectParams(req: NextApiRequest, zodError: ZodError): URLSearchParams {
  const params = new URLSearchParams()

  for (const issue of zodError.errors) {
    const top = issue.path[0]

    if (top === 'firstAt') {
      params.set('firstAtError', issue.message)
      continue
    }

    if (typeof top === 'string') {
      params.set(`${top}Error`, issue.message)
    }
  }

  const body = req.body as Partial<Record<string, unknown>>

  if (typeof body.studyId === 'string') {
    params.set('studyId', body.studyId)
  }

  for (const [key, value] of Object.entries(body)) {
    if (key === 'studyId') continue
    if (typeof value === 'string') {
      params.set(key, value)
    }
  }

  const firstAt = body.firstAt as { day?: unknown; month?: unknown; year?: unknown } | undefined
  if (firstAt && typeof firstAt === 'object') {
    if (typeof firstAt.day === 'string') params.set('firstAtDay', firstAt.day)
    if (typeof firstAt.month === 'string') params.set('firstAtMonth', firstAt.month)
    if (typeof firstAt.year === 'string') params.set('firstAtYear', firstAt.year)
  }

  if (isSafeReturnUrl(req.query.returnUrl)) {
    params.set('returnUrl', req.query.returnUrl)
  }

  return params
}

function buildFatalRedirectParams(req: NextApiRequest): URLSearchParams {
  const params = new URLSearchParams({ fatal: '1' })
  if (isSafeReturnUrl(req.query.returnUrl)) {
    params.set('returnUrl', req.query.returnUrl)
  }
  return params
}

export default withApiHandler<ExtendedNextApiRequest>(
  [Roles.SponsorContact],
  async (req, res, session) => {
    if (req.method !== ALLOWED_METHOD) {
      res.setHeader('Allow', ALLOWED_METHOD)
      return res.status(405).end('Method Not Allowed')
    }

    try {
      const parsed = reportFirstSchema.parse(req.body)

      const studyIdNumber = Number(parsed.studyId)
      const firstAtDate = datePartsToDate(parsed.firstAt)

      const upserted = await prismaClient.studyFirst.upsert({
        where: { studyId: studyIdNumber },
        create: {
          studyId: studyIdNumber,
          type: parsed.type,
          firstAt: firstAtDate,
          siteName: parsed.siteName,
          piTitle: nullIfBlank(parsed.piTitle),
          piFullName: parsed.piFullName,
          piEmail: parsed.piEmail,
          createdById: session.user.id,
          modifiedById: session.user.id,
        },
        update: {
          type: parsed.type,
          firstAt: firstAtDate,
          siteName: parsed.siteName,
          piTitle: nullIfBlank(parsed.piTitle),
          piFullName: parsed.piFullName,
          piEmail: parsed.piEmail,
          modifiedById: session.user.id,
          updatedAt: new Date(),
        },
      })

      logger.info(`Upserted StudyFirst for studyId: ${upserted.studyId}`)
      return res.redirect(302, CONFIRMATION_PATH)
    } catch (error) {
      logger.error(error)

      if (error instanceof ZodError) {
        const params = buildValidationRedirectParams(req, error)
        return redirectToReportFirst(res, params)
      }

      const fatalParams = buildFatalRedirectParams(req)
      return redirectToReportFirst(res, fatalParams)
    }
  }
)