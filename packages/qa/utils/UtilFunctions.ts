export function convertPromiseStringToNumber(inputString: string | undefined): number {
  let inputAsNumber = 0
  if (inputString != undefined) {
    inputAsNumber = parseInt(inputString)
    return inputAsNumber
  }
  return inputAsNumber
}

export function confirmStringNotNull(inputString: string | null): string {
  if (inputString != null) {
    return inputString
  } else {
    throw new Error(`The input string is null`)
  }
}

export function confirmStringNotUndefined(inputString: string | undefined): string {
  if (inputString != undefined) {
    return inputString
  } else {
    throw new Error(`The input string is undefined`)
  }
}

export function convertIsoDateToDisplayDate(inputDate: Date): string {
  const day = inputDate.getDate().toString()
  const month = inputDate.toLocaleString('default', { month: 'long' })
  const year = inputDate.getFullYear().toString()
  return day + ' ' + month + ' ' + year
}

export function convertIsoDateToDisplayTime(inputDateTime: Date): string {
  const hour = String(inputDateTime.getHours()).padStart(2, '0')
  const minutes = String(inputDateTime.getMinutes()).padStart(2, '0')
  const seconds = String(inputDateTime.getSeconds()).padStart(2, '0')
  return hour + ':' + minutes + ':' + seconds
}

export function numDaysBetween(d1: Date, d2: Date): number {
  const diff = Math.abs(d1.getTime() - d2.getTime())
  return diff / (1000 * 60 * 60 * 24)
}
