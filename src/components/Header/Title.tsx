import clsx from 'clsx'
import { ElementType, forwardRef, ReactNode } from 'react'

import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@/@types/components'

/**
 * HeaderTitle
 */
type HeaderTitleProps<C extends ElementType = ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Image destination */
    children: ReactNode
    /** Custom class name */
    className?: string
  }
>

export const HeaderTitle = forwardRef(
  <C extends React.ElementType = 'h1'>(
    { className, as, children, ...props }: HeaderTitleProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'h1'

    return (
      <Component
        ref={ref}
        className={clsx(
          'govuk-heading-m govuk-!-margin-bottom-0 govuk-!-margin-left-4 hidden text-white sm:block',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
