import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  children: ReactNode
}

export default function GatedChrome({ children }: Props) {
  return (
    <div className="app-shell">
      <header className="gated-chrome">
        <Link to="/account" className="gated-chrome__link">
          Account →
        </Link>
      </header>
      {children}
    </div>
  )
}
