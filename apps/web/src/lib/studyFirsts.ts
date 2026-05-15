import { prismaClient } from '@/lib/prisma'

export type GetStudyFirstByStudyIdResult = {
  data: {
    studyId: number
    type: string
    firstAt: Date | null
    siteName: string | null
    piTitle: string | null
    piFullName: string | null
    piEmail: string | null
  } | null
}

export async function getStudyFirstByStudyId(
  studyId: number,
  organisationIds: number[]
): Promise<GetStudyFirstByStudyIdResult> {
  if (!studyId || !Number.isFinite(studyId)) {
    return { data: null }
  }

  // Ensure the user has access to this study via organisation
  const study = await prismaClient.study.findFirst({
    where: {
      id: studyId,
      ...(organisationIds && {
        organisations: {
          some: {
            organisationId: {
              in: organisationIds,
            },
            isDeleted: false,
          },
        },
      }),
    },
    select: { id: true },
  })

  if (!study) {
    return { data: null }
  }

  const first = await prismaClient.studyFirst.findFirst({
    where: {
      studyId,
    },
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

  return { data: first ?? null }
}
