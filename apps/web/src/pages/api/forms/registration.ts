import { authService } from '@nihr-ui/auth'
import { Wso2GroupOperation } from '@nihr-ui/auth/src/constants/constants'
import { logger } from '@nihr-ui/logger'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ZodError } from 'zod'

import { REGISTRATION_CONFIRMATION_PAGE, REGISTRATION_PAGE } from '@/constants/routes'
import { getUserWithRolesAndOrgs } from '@/lib/organisations'
import { prismaClient } from '@/lib/prisma'
import { isContactManagerAndSponsorContact, isSponsorContact } from '@/utils/auth'
import type { RegistrationInputs } from '@/utils/schemas'
import { registrationSchema } from '@/utils/schemas'

export async function addUserGroup(email: string, group: string) {
  try {
    await authService.updateWSO2UserGroup(email, group, Wso2GroupOperation.Add)
  } catch (groupError) {
    logger.error(`Failed to assign role ${group} to user ${email}: ${groupError}`)
  }
}

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: RegistrationInputs
}

export default async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      throw new Error('Wrong method')
    }

    const { ODP_ROLE_GROUP_ID = '' } = process.env

    const { password, registrationToken, firstName, lastName } = registrationSchema.parse(req.body)

    const user = await prismaClient.user.findFirst({
      where: {
        registrationToken,
        isDeleted: false,
      },
    })

    if (!user?.email) {
      throw new Error(`No email found associated with the registrationToken ${registrationToken}`)
    }

    const givenName = firstName
    const familyName = lastName

    const createUserResponse = await authService.createUser({
      givenName,
      familyName,
      password,
      emails: [user.email],
    })

    if (createUserResponse.success) {
      if (!createUserResponse.data.id) {
        throw new Error('Missing data from IDG createUser response')
      }

      const { userName: identityGatewayId } = createUserResponse.data

      logger.info('Created user in IDG, updating user in local application')

      const { id } = await prismaClient.user.update({
        where: {
          email: user.email,
          isDeleted: false,
        },
        data: {
          identityGatewayId,
          registrationConfirmed: true,
          registrationToken: null,
        },
      })

      logger.info(
        `Updated local user ${id} with identityGatewayId ${identityGatewayId}, now redirecting to confirmation page`
      )

      const isEligibleForOdpRole = await isUserEligibleForOdpRole(user.id)
      if (isEligibleForOdpRole) {
        await addUserGroup(user.email, ODP_ROLE_GROUP_ID)
      }

      return res.redirect(302, REGISTRATION_CONFIRMATION_PAGE)
    }

    throw new Error('Failed to create user in IDG')
  } catch (error) {
    logger.error(error)

    const { registrationToken } = req.body

    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = Object.fromEntries(
        error.errors.map(({ path: [fieldId], message }) => [`${fieldId}Error`, message])
      )

      delete fieldErrors.registrationToken

      const searchParams = new URLSearchParams({ ...fieldErrors, registrationToken })
      return res.redirect(302, `${REGISTRATION_PAGE}?${searchParams.toString()}`)
    }

    const searchParams = new URLSearchParams({ fatal: '1', ...(registrationToken && { registrationToken }) })
    return res.redirect(302, `${REGISTRATION_PAGE}?${searchParams.toString()}`)
  }
}

export const isUserEligibleForOdpRole = async (userId: number): Promise<boolean> => {
  const userWithRolesAndOrgs = await getUserWithRolesAndOrgs(userId)

  if (!userWithRolesAndOrgs) {
    return false
  }

  const userRoleIds = userWithRolesAndOrgs.roles.map((role) => role.roleId)

  const hasClinicalResearchSponsorOrganisation = userWithRolesAndOrgs.organisations.some((orgRole) =>
    orgRole.organisation.roles.some((role) => role.role.name === 'Clinical Research Sponsor')
  )

  return (
    (isSponsorContact(userRoleIds) || isContactManagerAndSponsorContact(userRoleIds)) &&
    hasClinicalResearchSponsorOrganisation
  )
}
