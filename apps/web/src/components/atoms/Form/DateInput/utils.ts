export interface DateInputValue {
  year: string
  month: string
  day: string
}

export type DateFieldType = keyof DateInputValue

export const initialDateInputState: DateInputValue = {
  year: '',
  month: '',
  day: '',
}
