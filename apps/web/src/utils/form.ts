import type { ParsedUrlQuery } from 'node:querystring'
import type { FieldError, FieldErrors } from 'react-hook-form'
import type { assessmentSchema, organisationAddSchema, organisationRemoveContactSchema } from './schemas'

export type Schemas = typeof assessmentSchema | typeof organisationAddSchema | typeof organisationRemoveContactSchema

/**
 * Checks if there's any form errors present in the URL searchParams for a given schema
 */
export function hasErrorsInSearchParams(schema: Schemas, searchParams: ParsedUrlQuery) {
  return Object.keys(schema.shape).some((field) => searchParams[`${field}Error`])
}

/**
 * Extracts the persisted form values state from the URL searchParams for a given schema
 */
export function getValuesFromSearchParams(schema: Schemas, searchParams: ParsedUrlQuery) {
  return Object.fromEntries(
    Object.keys(schema.shape).map((field) => {
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
  const keys = Object.keys(schema.shape)

  // https://github.com/microsoft/TypeScript/issues/44373
  const keysArray: (typeof keys)[number][] = Object.keys(schema.shape)

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
