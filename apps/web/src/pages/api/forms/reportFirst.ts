import { logger } from '@nihr-ui/logger'
import type { NextApiRequest } from 'next'
import { ZodError } from 'zod'

import { Roles } from '@/constants'
import { REPORT_FIRSTS_PAGE } from '@/constants/routes'
import { prismaClient } from '@/lib/prisma'
import { reportFirstSchema, type ReportFirstInputs } from '@/utils/schemas/reportFirst.schema'
import { withApiHandler } from '@/utils/withApiHandler'

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: ReportFirstInputs
}

function isSafeReturnUrl(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
}

function appendSearchParam(url: string, key: string, value: string) {
  const [path, qs] = url.split('?')
  const params = new URLSearchParams(qs ?? '')
  params.set(key, value)
  return `${path}?${params.toString()}`
}

function datePartsToDate(firstAt: { day: string; month: string; year: string }) {
  const day = Number(firstAt.day)
  const month = Number(firstAt.month)
  const year = Number(firstAt.year)
  return new Date(year, month - 1, day)
}

export default withApiHandler<ExtendedNextApiRequest>(
  [Roles.SponsorContact],
  async (req, res, session) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).end('Method Not Allowed')
    }

    try {
      const parsed = reportFirstSchema.parse(req.body)

      const {
        studyId,
        type,
        firstAt,
        siteName,
        piTitle,
        piFullName,
        piEmail,
      } = parsed

      const studyIdNumber = Number(studyId)
      const firstAtDate = datePartsToDate(firstAt)

      const upserted = await prismaClient.studyFirst.upsert({
        where: { studyId: studyIdNumber },
        create: {
          studyId: studyIdNumber,
          type,
          firstAt: firstAtDate,
          siteName,
          piTitle: piTitle?.trim() ? piTitle.trim() : null,
          piFullName,
          piEmail,
          createdById: session.user.id,
          modifiedById: session.user.id,
        },
        update: {
          type,
          firstAt: firstAtDate,
          siteName,
          piTitle: piTitle?.trim() ? piTitle.trim() : null,
          piFullName,
          piEmail,
          modifiedById: session.user.id,
          updatedAt: new Date(),
        },
      })

      logger.info(`Upserted StudyFirst for studyId: ${upserted.studyId}`)

      const returnUrl = isSafeReturnUrl(req.query.returnUrl) ? req.query.returnUrl : ''

      // ✅ Decide where you want to go after success:
      // - If returnUrl was supplied, go there (and add success flag)
      // - Otherwise go to the study detail page
      if (returnUrl) {
        return res.redirect(302, appendSearchParam(returnUrl, 'success', 'first'))
      }

      return res.redirect(302, `/studies/${studyId}?success=first`)
    } catch (error) {
      logger.error(error)

      // ---------- Zod validation errors ----------
      if (error instanceof ZodError) {
        const searchParams = new URLSearchParams()

        // Attach field-level errors as query params: <field>Error=<message>
        for (const issue of error.errors) {
          // If you validate the date object as a whole, path might be ['firstAt']
          // If it’s per-part, path might be ['firstAt','day'] etc.
          const top = issue.path[0]
          const sub = issue.path[1]

          if (top === 'firstAt') {
            // Prefer a single message for the whole date input
            searchParams.set('firstAtError', issue.message)

            // If your UI expects per-part errors, you could also do:
            // if (typeof sub === 'string') searchParams.set(`firstAt${sub[0].toUpperCase()}${sub.slice(1)}Error`, issue.message)
            continue
          }

          if (typeof top === 'string') {
            searchParams.set(`${top}Error`, issue.message)
          }
        }

        // Echo values back safely so the form can be repopulated after redirect
        const body = req.body as Partial<Record<string, unknown>>

        // Keep study selection
        if (typeof body.studyId === 'string') {
          searchParams.set('studyId', body.studyId)
        }

        // Simple string fields
        for (const [key, value] of Object.entries(body)) {
          if (typeof value === 'string' && key !== 'studyId') {
            searchParams.set(key, value)
          }
        }

        // Date object (if present)
        const firstAt = body.firstAt as { day?: unknown; month?: unknown; year?: unknown } | undefined
        if (firstAt && typeof firstAt === 'object') {
          if (typeof firstAt.day === 'string') searchParams.set('firstAtDay', firstAt.day)
          if (typeof firstAt.month === 'string') searchParams.set('firstAtMonth', firstAt.month)
          if (typeof firstAt.year === 'string') searchParams.set('firstAtYear', firstAt.year)
        }

        // Propagate returnUrl
        if (isSafeReturnUrl(req.query.returnUrl)) {
          searchParams.set('returnUrl', req.query.returnUrl)
        }

        return res.redirect(302, `${REPORT_FIRSTS_PAGE}?${searchParams.toString()}`)
      }

      // ---------- Fatal errors ----------
      const fatalParams = new URLSearchParams({ fatal: '1' })
      if (isSafeReturnUrl(req.query.returnUrl)) {
        fatalParams.set('returnUrl', req.query.returnUrl)
      }

      return res.redirect(302, `${REPORT_FIRSTS_PAGE}?${fatalParams.toString()}`)
    }
  }
)