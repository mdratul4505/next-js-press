import { getMe } from '@/service/getme'
import { Navbar } from './navbar'
import React, { Suspense } from 'react'

const NavbarWrapper = async () => {
  const user = await getMe()
  return <Navbar user={user} />
}

export default function SuspendedNavbar() {
  return (
    <Suspense fallback={
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span className="text-2xl font-bold text-primary">NextJs Press</span>
          </div>
        </div>
      </nav>
    }>
      <NavbarWrapper />
    </Suspense>
  )
}
