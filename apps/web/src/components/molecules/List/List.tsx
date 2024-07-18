import clsx from 'clsx'
import type { ElementType, ReactNode } from 'react'

interface ListProps<Element extends ElementType = ElementType> {
  /** Content to be rendered within the Card */
  children: ReactNode
  /** Custom class name for the Card element */
  className?: string
  /** Heading to appear above the list */
  heading?: string
  /** Element/component/tag the Card will be rendered as (default: <div>) */
  as?: Element
}

export function List<Element extends ElementType = 'ul'>({
  children,
  className,
  heading,
  as,
  ...props
}: ListProps<Element>) {
  const Component = as ?? 'ul'
  const listStyle = as === 'ol' ? 'govuk-list--number' : 'govuk-list--bullet'
  return (
    <>
      {heading ? (
        <h3 aria-hidden className="govuk-heading-s mb-3">
          {heading}
        </h3>
      ) : null}
      <Component className={clsx('govuk-list', listStyle, className)} {...props}>
        {children}
      </Component>
    </>
  )
}

interface ListItemProps {
  /** Content to be rendered within the Card */
  children: ReactNode
  /** Custom class name for the Card element */
  className?: string
  /** Icon to appear before the child content */
  icon?: ReactNode
}

export function ListItem({ children, icon, className, ...props }: ListItemProps) {
  return (
    <li
      className={clsx('govuk-body govuk-!-margin-bottom-2', className, {
        'flex list-none items-start gap-x-2 gap-y-1': Boolean(icon),
      })}
      {...props}
    >
      {icon}
      {children}
    </li>
  )
}
