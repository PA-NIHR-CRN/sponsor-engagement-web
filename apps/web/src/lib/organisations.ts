import { Prisma, prismaClient } from './prisma'

export type StudyOrganisationWithRelations = Prisma.StudyOrganisationGetPayload<{
  include: { organisation: true; organisationRole: true }
}>

type OrganisationRoleShortNameMap = typeof organisationRoleShortName

export type OrganisationRoleShortName = OrganisationRoleShortNameMap[keyof OrganisationRoleShortNameMap]

// Organisation role mappings formatted for the UI
export const organisationRoleShortName = {
  'Clinical Research Sponsor': 'Sponsor',
  'Contract Research Organisation': 'CRO',
  'Managing Clinical Trials Unit': 'CTU',
} as const

export const isClinicalResearchSponsor = (studyOrg: StudyOrganisationWithRelations) =>
  studyOrg.organisationRole.name === 'Clinical Research Sponsor'

export const getSponsorOrgName = (studyOrgs: StudyOrganisationWithRelations[]) =>
  studyOrgs.find((org) => isClinicalResearchSponsor(org))?.organisation.name

export const getSupportOrgName = (studyOrgs: StudyOrganisationWithRelations[]) =>
  studyOrgs.find((org) => !isClinicalResearchSponsor(org))?.organisation.name

export const getUserOrganisations = async (userId: number) => {
  return prismaClient.userOrganisation.findMany({
    where: {
      userId,
      isDeleted: false,
    },
  })
}

export const getStudyOrganisations = async ({
  currentPage,
  pageSize,
  searchTerm,
  userId,
}: {
  currentPage: number
  pageSize: number
  searchTerm: string | null
  userId?: number
}) => {
  const userOrgsQuery = {
    users: {
      some: {
        userId: {
          equals: userId,
        },
        isDeleted: {
          equals: false,
        },
      },
    },
  }

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
        name: {
          contains: searchTerm,
        },
      }),
      studies: {
        some: {},
      },
      ...(userId !== undefined && userOrgsQuery),
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

const organisationByIdRelations = {
  include: {
    roles: { include: { role: true } },
    users: {
      where: {
        isDeleted: false,
      },
      include: {
        user: true,
        invitations: {
          select: {
            status: {
              select: {
                name: true,
              },
            },
          },
          where: {
            isDeleted: false,
          },
          distinct: [Prisma.UserOrganisationInvitationScalarFieldEnum.userOrganisationId],
          orderBy: { timestamp: Prisma.SortOrder.desc },
        },
      },
      orderBy: {
        updatedAt: Prisma.SortOrder.desc,
      },
    },
  },
}

export type OrganisationWithRelations = Prisma.OrganisationGetPayload<typeof organisationByIdRelations>

export const getOrganisationById = async (organisationId: number) => {
  const query = {
    where: {
      id: organisationId,
      isDeleted: false,
    },
    ...organisationByIdRelations,
  }

  const organisation = await prismaClient.organisation.findFirst(query)

  if (!organisation) return null

  return {
    ...organisation,
    roles: organisation.roles.map(({ role }) => organisationRoleShortName[role.name]).filter(Boolean),
  }
}

const userOrganisationByIdRelations = {
  include: {
    organisation: true,
    user: true,
  },
}

export type UserOrganisationWithRelations = Prisma.UserOrganisationGetPayload<typeof userOrganisationByIdRelations>

export const getUserOrganisationById = async (userOrganisationId: number) => {
  const query = {
    where: { id: userOrganisationId },
    ...userOrganisationByIdRelations,
  }

  const userOrganisation = await prismaClient.userOrganisation.findFirst(query)

  return userOrganisation
}

export const getUserWithRolesAndOrgs = async (userId: number) => {
  return prismaClient.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        where: { isDeleted: false },
        select: { roleId: true },
      },
      organisations: {
        where: {
          isDeleted: false,
          organisation: {
            isDeleted: false,
          },
        },
        include: {
          organisation: {
            include: {
              roles: {
                select: {
                  role: {
                    select: { name: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
}
