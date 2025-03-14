import clsx from 'clsx'
import {
  createContext,
  Dispatch,
  ElementType,
  forwardRef,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react'

import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@nihr-ui/frontend/@types/components'

import { HomeIcon } from '../Icons/HomeIcon'

type SideNavContextType = {
  forceHidden?: boolean
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const SideNavContext = createContext<SideNavContextType | null>(null)

type SideNavProviderProps = { children: ReactNode } & Partial<SideNavContextType>

export function SideNavProvider({ children, ...props }: SideNavProviderProps) {
  const [open, setOpen] = useState(false)
  return <SideNavContext.Provider value={{ open, setOpen, ...props }}>{children}</SideNavContext.Provider>
}

function useSideNav() {
  const context = useContext(SideNavContext)
  if (!context) {
    throw new Error('useSideNav must be used within a SideNavProvider')
  }
  return context
}

/**
 * SideNavTrigger
 */
type SideNavTriggerProps<C extends ElementType = ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Custom class name */
    className?: string

    /** Override the icon to display inside the trigger */
    icon?: string
  }
>

export const SideNavTrigger = forwardRef(
  <C extends React.ElementType = 'button'>(
    { className, as, icon, ...props }: SideNavTriggerProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const { forceHidden, open, setOpen } = useSideNav()

    const Component = as || forceHidden ? 'a' : 'button'

    const linkProps = {
      href: '/',
      'aria-label': 'Go to homepage',
    }

    const buttonProps = {
      'aria-expanded': open,
      'aria-controls': 'nihr-side-nav',
      'aria-label': `${open ? 'Hide' : 'Show'} navigation menu`,
      onClick: () => setOpen(!open),
    }

    const componentProps = forceHidden ? linkProps : buttonProps

    return (
      <div className="flex h-[3rem] w-[3rem] items-center justify-center">
        <Component
          ref={ref}
          className={clsx(
            'flex h-[3rem] w-[3rem] items-center justify-center rounded-full transition duration-200 ease-in-out motion-reduce:transition-none [&:focus]:bg-[rgba(255,255,255,0.1)] [&:focus]:shadow-[0_2px_0_#fff,_0_-2px_0_#fff,_2px_0_0_#fff,_-2px_0_0_#fff] [&:focus]:outline-none',
            { 'bg-[rgba(255,255,255,0.1)]': open, 'translate-x-[-.75rem]': !open },
            className
          )}
          {...componentProps}
          {...props}
        >
          <div className="transition-all duration-150 ease-in-out">
            <div className="flex h-[18px] w-[18px] items-center text-white">
              {icon || forceHidden ? (
                <HomeIcon />
              ) : (
                <div
                  className={clsx(
                    'absolute h-[2px] w-[18px] rounded-[3px] bg-white transition-transform before:absolute before:-top-1 before:block before:h-[2px] before:w-[18px] before:rounded-[3px] before:bg-white before:transition-transform after:absolute after:-bottom-1 after:block after:h-[2px] after:w-[18px] after:rounded-[3px] after:bg-white after:transition-transform',
                    {
                      'before:translate-x-[-5px] before:translate-y-[1px] before:-rotate-45 before:scale-x-[0.7] after:translate-x-[-5px] after:translate-y-[-1px] after:rotate-45 after:scale-x-[0.7]':
                        open,
                    }
                  )}
                />
              )}
            </div>
          </div>
        </Component>
      </div>
    )
  }
)

/**
 * SideNavPanel
 */
type SideNavPanelProps<C extends ElementType = ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Contents to display inside the nav panel */
    children: ReactNode

    /** Custom class name */
    className?: string
  }
>

export const SideNavPanel = forwardRef(
  <C extends React.ElementType = 'nav'>(
    { className, as, children, ...props }: SideNavPanelProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'nav'

    const { open } = useSideNav()

    return (
      <Component
        ref={ref}
        id="nihr-side-nav"
        role="navigation"
        aria-label="Main application links"
        className={clsx(
          'transition-width absolute bottom-0 top-[var(--header-height)] z-20 overflow-hidden bg-[var(--side-nav-bg)] shadow-[2px_0px_4px_0_rgba(0,0,0,.1)] duration-200 ease-in-out motion-reduce:transition-none',
          { 'w-[var(--side-nav-width-collapsed)]': !open },
          { 'w-[var(--side-nav-width-expanded)]': open },
          className
        )}
        {...props}
      >
        <ul className={clsx('transition-all duration-200 ease-in-out', { 'p-2': open })}>{children}</ul>
      </Component>
    )
  }
)

/**
 * SideNavMain
 */
type SideNavMainProps<C extends ElementType = ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Contents to display inside the nav panel */
    children: ReactNode

    /** Custom class name */
    className?: string
  }
>

export const SideNavMain = forwardRef(
  <C extends React.ElementType = 'main'>(
    { className, as, children, ...props }: SideNavMainProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'main'

    const { forceHidden } = useSideNav()

    return (
      <Component
        ref={ref}
        id="main-content"
        role="main"
        className={clsx(
          'govuk-main-wrapper',
          {
            'pl-[var(--side-nav-width-collapsed)]': !forceHidden,
          },
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

/**
 * SideNavLink
 */
type SideNavLinkProps<C extends ElementType = ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Link content */
    children: ReactNode

    /** Link destination */
    href: string

    /** Icon to display before the link text */
    icon?: ReactNode

    /** Custom class name */
    className?: string
  }
>

export const SideNavLink = forwardRef(
  <C extends React.ElementType = 'a'>(
    { className, as, children, href, icon, ...props }: SideNavLinkProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'a'

    const { open } = useSideNav()

    return (
      <li>
        <Component
          ref={ref}
          href={href}
          className={clsx(
            'text-[var(--colour-cobalt)] navigation-link navigation-link--active govuk-!-padding-left-3 govuk-!-padding-right-3 govuk-!-padding-top-3 govuk-!-padding-bottom-3 govuk-link govuk-link--no-visited-state flex items-start text-sm no-underline hover:underline',
            { 'w-[calc(var(--side-nav-width-expanded) - 1.5rem)]': open },
            className
          )}
          {...props}
        >
          {/* Icon Container */}
          <div className="icon-container flex items-start">{icon}</div>

          {/* Text Container */}
          <div
            className={clsx('text-container flex items-center opacity-0 transition-opacity duration-200 ease-in-out', {
              'opacity-100 whitespace-normal': open,
              'whitespace-nowrap': !open,
              absolute: !open,
            })}
          >
            <span className="govuk-!-margin-left-4">{children}</span>
          </div>
        </Component>
      </li>
    )
  }
)

export const SideNav = {
  Provider: SideNavProvider,
  Trigger: SideNavTrigger,
  Panel: SideNavPanel,
  Link: SideNavLink,
  Main: SideNavMain,
}
