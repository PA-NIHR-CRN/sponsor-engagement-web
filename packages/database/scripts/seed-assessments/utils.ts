export const parseDate = (value: string) => {
  const parts = value.split(' ')

  const dateParts = parts[0].split('/').map(Number)
  const [day, month, year] = dateParts

  const timeParts = parts[1].split(':').map(Number)
  const [hours, minutes, seconds] = timeParts

  return new Date(year, month - 1, day, hours, minutes, seconds)
}
