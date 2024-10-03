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

/**
 * Checks to see if all date parts in type DateInputValue is empty
 */
export const areAllDatePartsEmpty = (dateParts: DateInputValue) => Object.values(dateParts).every((val) => val === '')

/**
 * Gets the maximum amount of days within a given month - takes into consideration leap years
 */
export const getDaysInMonth = (month: number, year?: number) => {
  // month values - 0 to 11
  switch (month) {
    case 1:
      if (!year) return 28
      return (year % 4 === 0 && year % 100) || year % 400 === 0 ? 29 : 28
    case 8:
    case 3:
    case 5:
    case 10:
      return 30
    default:
      return 31
  }
}
