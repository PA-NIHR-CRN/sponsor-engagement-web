import { logger } from '@nihr-ui/logger'
import type { NextApiResponse } from 'next'

import { prismaClient } from '@/lib/prisma'

export default async function handler(req, res: NextApiResponse) {
    
  if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      res.status(405).end('Method Not Allowed')
      return res
    }

    const raw = req.query.studyId
    const studyIdStr = Array.isArray(raw) ? raw[0] : raw
    const studyId = typeof studyIdStr === 'string' ? Number(studyIdStr) : NaN

    if (!Number.isFinite(studyId)) {
      res.status(400).json({ message: 'Invalid studyId' }); return;
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
      res.status(200).json({ first: first ?? null }); 
    } catch (error) {
      logger.error(error)
      res.status(500).json({ message: 'Failed to load first record' }); 
    }
}