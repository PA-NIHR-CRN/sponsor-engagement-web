import type { ParsedUrlQuery } from 'node:querystring'

import type { FieldError, FieldErrors } from 'react-hook-form'
import Zod from 'zod'

import type {
  assessmentSchema,
  organisationAddSchema,
  organisationRemoveContactSchema,
  registrationSchema,
} from './schemas'

export type Schemas =
  | typeof assessmentSchema
  | typeof organisationAddSchema
  | typeof organisationRemoveContactSchema
  | typeof registrationSchema

/**
 * Checks if there's any form errors present in the URL searchParams for a given schema
 */
export function hasErrorsInSearchParams(schema: Schemas, searchParams: ParsedUrlQuery) {
  const shape = schema instanceof Zod.ZodEffects ? schema._def.schema.shape : schema.shape

  return Object.keys(shape).some((field) => searchParams[`${field}Error`])
}

/**
 * Extracts the persisted form values state from the URL searchParams for a given schema
 */
export function getValuesFromSearchParams(schema: Schemas, searchParams: ParsedUrlQuery) {
  const shape = schema instanceof Zod.ZodEffects ? schema._def.schema.shape : schema.shape

  return Object.fromEntries(
    Object.keys(shape).map((field) => {
      const value = searchParams[field]

      if (value) {
        // Checkbox groups return a comma delimited list of values
        if (value.includes(',')) {
          return [field, String(searchParams[field]).split(',')]
        }
        // Everything else just returns a value
        return [field, value]
      }

      return [field, undefined]
    })
  )
}

/**
 * Extracts the persisted form error state from the URL searchParams for a given schema
 */
export function getErrorsFromSearchParams(schema: Schemas, searchParams: ParsedUrlQuery) {
  const shape = schema instanceof Zod.ZodEffects ? schema._def.schema.shape : schema.shape

  const keys = Object.keys(shape)

  // https://github.com/microsoft/TypeScript/issues/44373
  const keysArray: (typeof keys)[number][] = Object.keys(shape)

  return keysArray.reduce<FieldErrors>((errors, field) => {
    if (searchParams[`${field}Error`]) {
      const error: FieldError = {
        type: 'custom',
        message: searchParams[`${field}Error`] as string,
      }
      errors[field] = error
    }
    return errors
  }, {})
}
