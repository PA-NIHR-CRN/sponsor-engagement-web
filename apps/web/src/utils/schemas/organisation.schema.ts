import * as z from 'zod'

export type OrganisationAddInputs = z.infer<typeof organisationAddSchema>

export const organisationAddSchema = z
  .object({
    organisationId: z.string(),
    emailAddress: z.string().email('Enter a valid email address').min(1, { message: 'Enter an email address' }),
  })
  .required()

export type OrganisationRemoveContactInputs = z.infer<typeof organisationRemoveContactSchema>

export const organisationRemoveContactSchema = z
  .object({
    userOrganisationId: z.string(),
  })
  .required()
