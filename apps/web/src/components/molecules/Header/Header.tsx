import type { Session } from 'next-auth'

interface HeaderProps {
  user?: Session['user']
}

export function Header({ user }: HeaderProps) {
  return (
    <>
     {user ? 
        <li className="rebranded-one-login-header__nav__list-item">
          <span className="rebranded-one-login-header__nav__text logged-in-username">
            {user.email}
          </span>
        </li>
     : null}
    </>
  )
}