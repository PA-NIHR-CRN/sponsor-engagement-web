import type { EditHistoryChange } from '../types'
import { getColumnChangedLabelText } from './utils'

export function EditHistoryChangeText({ change }: { change: EditHistoryChange }) {
  const { afterValue, beforeValue, columnChanged } = change

  const columnLabel = getColumnChangedLabelText(columnChanged)

  if (beforeValue && afterValue) {
    return (
      <li>
        {columnLabel} changed from {beforeValue} to {afterValue}
      </li>
    )
  } else if (beforeValue && !afterValue) {
    return (
      <li>
        {columnLabel} {beforeValue} removed
      </li>
    )
  }

  return (
    <li>
      {columnLabel} {afterValue} added
    </li>
  )
}
