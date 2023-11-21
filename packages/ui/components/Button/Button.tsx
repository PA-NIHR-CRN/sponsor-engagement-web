import { clsx } from 'clsx'
import { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  secondary?: boolean
  warning?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  children,
  secondary = false,
  warning = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const styles = clsx(className, {
    'govuk-button': true,
    'govuk-button--secondary': secondary,
    'govuk-button--warning': warning,
  })
  return (
    <button {...props} className={styles} type={type}>
      {children}
    </button>
  )
}
