import { Roles } from '@/constants'

import { Prisma, prismaClient } from './prisma'

export type UserWithRoles = Prisma.UserGetPayload<{
  include: { roles: true }
}>

export const getContactManagerUsers = async () => {
  return prismaClient.user.findMany({
    include: {
      roles: {
        where: {
          roleId: Roles.ContactManager,
        },
      },
    },
    where: {
      roles: {
        some: {
          roleId: Roles.ContactManager,
          isDeleted: false,
        },
      },
      isDeleted: false,
    },
    orderBy: [{ email: Prisma.SortOrder.asc }],
  })
}
