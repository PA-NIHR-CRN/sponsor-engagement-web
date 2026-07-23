import type { Session } from 'next-auth'

interface HeaderProps {
  user?: Session['user']
}

export function Header({ user }: HeaderProps) {
  return (
    <>
     {user ? <>
        <li className="rebranded-one-login-header__nav__list-item">
          <span className="rebranded-one-login-header__nav__text logged-in-username">
            {user.email}
          </span>
        </li>
        <li className="rebranded-one-login-header__nav__list-item">
          <a className="rebranded-one-login-header__nav__link sign-out-nav__link" href="/auth/signout">
              <span className="rebranded-one-login-header__nav__text rebranded-one-login-header__nav__text--sign-out">Sign out</span>
          </a>
      </li>
      </>
     : null}
    </>
  )
}