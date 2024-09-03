export interface DateInputValue {
  year: string
  month: string
  day: string
}

export type DateFieldType = keyof DateInputValue

// Parses a date with ISO format (YYYY-MM-DD) into it's respective parts
export const parseISODateIntoParts = (date?: string) => {
  if (!date)
    return {
      year: '',
      month: '',
      day: '',
    }

  const [year, month, day] = date.split('-')
  return {
    year,
    month,
    day,
  }
}

// Constructs a date with ISO format (YYYY-MM-DD) from it's respective parts
export const constructISODateFromParts = (date: DateInputValue) =>
  `${date.year || ''}-${date.month || ''}-${date.day || ''}`

export const initialDateInputState: DateInputValue = {
  year: '',
  month: '',
  day: '',
}
