import dayjs from 'dayjs'
import { DATE_FORMAT } from '../constants'

/**
 * Formats a date using the default govuk format e.g. 13 June 2023
 */
export const formatDate = (date: string | Date) => dayjs(date).format(DATE_FORMAT)
