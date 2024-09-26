import dayjs from 'dayjs'

import type { DateInputValue } from '@/components/atoms/Form/DateInput/types'
import { SE_GDPR_COOKIE_EXPIRY_MONTHS } from '@/constants/cookies'

import { DATE_FORMAT, DATE_FORMAT_SHORT } from '../constants'

/**
 * Formats a date using the default govuk format e.g. 13 June 2023
 */
export const formatDate = (date: string | Date, type: 'long' | 'short' = 'long') =>
  dayjs(date).format(type === 'long' ? DATE_FORMAT : DATE_FORMAT_SHORT)

export const getGDPRCookieExpiryDate = () => dayjs().add(SE_GDPR_COOKIE_EXPIRY_MONTHS, 'M').toDate()

/**
 * Gets the year, month and day from a Date object
 */

// TODO: Check if I need to use UTC or not?
export const constructDatePartsFromDate = (date?: Date | null) => {
  if (!date) return undefined

  const day = date.getDate().toString()
  const month = (date.getMonth() + 1).toString()
  const year = date.getFullYear().toString()

  return { year, month, day }
}

/**
 * Creates a Date object from its' date parts - year, month and day
 */
export const constructDateObjFromParts = (dateParts?: DateInputValue | null) => {
  if (!dateParts) return undefined

  const containsAllValidNumbers = Object.values(dateParts).every(
    (val: string) => !Number.isNaN(Number(val)) && val.trim() !== ''
  )

  if (!containsAllValidNumbers) {
    return undefined
  }

  const { year, month, day } = dateParts

  return new Date(`${Number(year)}-${Number(month)}-${Number(day)}`)
}
