import clsx from 'clsx'
import { ElementType, ReactNode } from 'react'

type ListProps<Element extends ElementType = ElementType> = {
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
      {heading && (
        <h3 className="govuk-heading-s mb-3" aria-hidden>
          {heading}
        </h3>
      )}
      <Component className={clsx('govuk-list', listStyle, className)} {...props}>
        {children}
      </Component>
    </>
  )
}

type ListItemProps = {
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
        'flex list-none items-start gap-x-2 gap-y-1': !!icon,
      })}
      {...props}
    >
      {icon}
      {children}
    </li>
  )
}
