import clsx from 'clsx'
import { ElementType, forwardRef, ReactNode } from 'react'
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@nihr-ui/frontend/@types/components'

/**
 * LogoLink
 */
type LogoLinkProps<C extends ElementType = ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Link href destination */
    href?: string
    /** Content to be rendered inside the link */
    children: ReactNode
    /** Custom class name */
    className?: string
  }
>

export const LogoLink = forwardRef(
  <C extends React.ElementType = 'a'>(
    { children, className, as, href = 'https://www.nihr.ac.uk/', ...props }: LogoLinkProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'a'

    return (
      <Component
        ref={ref}
        href={href}
        className={clsx('govuk-header__link govuk-!-margin-left-4', className)}
        target="_blank"
        aria-label="Go to n i h r .ac.uk (opens in new tab)"
        {...props}
      >
        {children}
      </Component>
    )
  }
)

/**
 * LogoImage
 */
type LogoImageProps<C extends ElementType = ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Image destination */
    src: string
    /** Custom class name */
    className?: string
  }
>

export const LogoImage = forwardRef(
  <C extends React.ElementType = 'img'>(
    { className, as, src, ...props }: LogoImageProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'img'

    return (
      <span className="govuk-header__logotype">
        <div className="flex items-center gap-2">
          <Component
            ref={ref}
            src={src}
            width={154}
            height={18}
            alt="National Institute for Health and Care Research logo"
            className={className}
            {...props}
          />
        </div>
      </span>
    )
  }
)

export const Logo = {
  Link: LogoLink,
  Image: LogoImage,
}
