import { Prisma, prismaClient } from './prisma'

export type StudyOrganisationWithRelations = Prisma.StudyOrganisationGetPayload<{
  include: { organisation: true; organisationRole: true }
}>

// Organisation role mappings formatted for the UI
export const organisationRoleShortName = {
  'Clinical Research Sponsor': 'Sponsor',
  'Contract Research Organisation': 'CRO',
  'Managing Clinical Trials Unit': 'CTO',
} as const

export const getUserOrganisations = async (userId: number) => {
  return prismaClient.userOrganisation.findMany({
    where: {
      userId,
    },
  })
}

export const getStudyOrganisations = async ({
  currentPage,
  pageSize,
  searchTerm,
}: {
  currentPage: number
  pageSize: number
  searchTerm: string | null
}) => {
  const query = {
    skip: currentPage * pageSize - pageSize,
    take: pageSize,
    select: {
      id: true,
      name: true,
      roles: {
        select: {
          role: true,
        },
      },
    },
    orderBy: [{ name: Prisma.SortOrder.asc }],
    where: {
      ...(searchTerm && {
        OR: [
          {
            name: {
              contains: searchTerm,
            },
          },
        ],
      }),
      studies: {
        some: {},
      },
      isDeleted: false,
    },
  }

  const [organisations, total] = await prismaClient.$transaction([
    prismaClient.organisation.findMany({ ...query }),
    prismaClient.organisation.count({ where: query.where }),
  ])

  return {
    pagination: {
      total,
    },
    data: organisations.map(({ id, name, roles }) => ({
      id,
      name,
      roles: roles.map(({ role }) => organisationRoleShortName[role.name]).filter(Boolean),
    })),
  }
}

export const isClinicalResearchSponsor = (studyOrg: StudyOrganisationWithRelations) =>
  studyOrg.organisationRole.name === 'Clinical Research Sponsor'
