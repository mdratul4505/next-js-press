import SuspendedNavbar from '@/components/shared/navbar-server'
import React from 'react'

const PublicLayout = async(
    {
        children,
    } : {
        children :React.ReactNode
    }
) => {
  return (
    <div>
        <SuspendedNavbar />
    {children}
    </div>
  )
}

export default PublicLayout