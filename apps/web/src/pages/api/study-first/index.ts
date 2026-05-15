import { logger } from '@nihr-ui/logger'
import type { NextApiRequest, NextApiResponse } from 'next'

import { prismaClient } from '@/lib/prisma'

interface SuccessResponse {
  first: {
    studyId: number
    type: string
    firstAt: Date
    siteName: string
    piTitle: string | null
    piFullName: string
    piEmail: string
  } | null
}

interface ErrorResponse { message: string }

function getSingleQueryParam(value: NextApiRequest['query'][string]) {
  return Array.isArray(value) ? value[0] : value
}

function parseStudyId(query: NextApiRequest['query']): number | null {
  const raw = getSingleQueryParam(query.studyId)
  if (typeof raw !== 'string') return null

  const id = Number(raw)
  if (!Number.isFinite(id) || id <= 0) return null

  return id
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method Not Allowed')
    return
  }

  const studyId = parseStudyId(req.query)
  if (studyId === null) {
    res.status(400).json({ message: 'Invalid studyId' })
    return
  }

  try {
    const first = await prismaClient.studyFirst.findFirst({
      where: { studyId },
      select: {
        studyId: true,
        type: true,
        firstAt: true,
        siteName: true,
        piTitle: true,
        piFullName: true,
        piEmail: true,
      },
    })

    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({ first: first ?? null })
    
  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'Failed to load first record' })
    
  }
}