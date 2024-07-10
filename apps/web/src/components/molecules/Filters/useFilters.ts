import type { RefObject } from 'react'

export type OnFilterChange = (formValues: Record<string, unknown>) => void

export const useFilters = (formRef: RefObject<HTMLFormElement>, onFilterChange?: OnFilterChange) => {
  const onChange = () => {
    if (!formRef.current) return

    const formData = new FormData(formRef.current)

    // https://stackoverflow.com/a/62010324
    const formDataAsObject = Object.fromEntries(
      Array.from(formData.keys()).map((key) => [
        key,
        formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key),
      ])
    )

    onFilterChange?.(formDataAsObject)
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onChange()
  }

  return { onChange, onSubmit }
}
