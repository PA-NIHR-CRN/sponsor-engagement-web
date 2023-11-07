import dayjs from 'dayjs'
import { DATE_FORMAT, DATE_FORMAT_SHORT } from '../constants'

/**
 * Formats a date using the default govuk format e.g. 13 June 2023
 */
export const formatDate = (date: string | Date, type: 'long' | 'short' = 'long') =>
  dayjs(date).format(type === 'long' ? DATE_FORMAT : DATE_FORMAT_SHORT)
