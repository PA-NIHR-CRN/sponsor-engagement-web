import { StatusFilter } from '@/@types/filters';

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'in-setup', label: 'In setup' },
  { value: 'open', label: 'Open' },
  { value: 'suspended', label: 'Suspended' },
]

export const STATUS_LABEL: Record<StatusFilter, string> = {
  'in-setup': 'In setup',
  open: 'Open',
  suspended: 'Suspended',
}

export function StudyStatusFilters({
  selected = [],
  onChange,
  disabled,
}: Readonly<{
  selected?: StatusFilter[]
  onChange: () => void
  disabled?: boolean
}>) {
  return (
    <fieldset className="govuk-fieldset" aria-describedby="study-status-hint">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--s govuk-!-margin-bottom-4">
        Study status
      </legend>

      <div className="govuk-checkboxes">
        {STATUS_OPTIONS.map((opt) => (
          <div className="govuk-checkboxes__item" key={opt.value}>
            <input
              className="govuk-checkboxes__input"
              id={`status-${opt.value}`}
              name="status"
              type="checkbox"
              value={opt.value}
              checked={selected.includes(opt.value)}
              disabled={disabled}
              onChange={() => onChange()}
            />
            <label
              className="govuk-label govuk-checkboxes__label"
              htmlFor={`status-${opt.value}`}
            >
              {opt.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  )
}
