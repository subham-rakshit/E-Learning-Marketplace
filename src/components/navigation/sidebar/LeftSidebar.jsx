'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { AiOutlineCarryOut, AiOutlineTeam } from 'react-icons/ai'
import { MdAccountCircle } from 'react-icons/md'
import { RiDashboard2Fill } from 'react-icons/ri'
import { FaUsers } from 'react-icons/fa'
import { GrGallery } from 'react-icons/gr'
import { NavigationTabs } from '@/components'

const LeftSidebar = () => {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  // Profile Tab
  const commonPorfileTab = () => (
    <NavigationTabs
      hrefLink='/profile'
      comparePathName='/profile'
      tabName='Profile'
      icon={<MdAccountCircle size={16} />}
    />
  )

  return (
    <>
      {/* Only For Subscriber */}
      {session &&
      status === 'authenticated' &&
      session.user.role.includes('Subscriber') ? (
        <>
          {/* User Dashboard */}
          <NavigationTabs
            hrefLink='/user/dashboard'
            comparePathName='/user/dashboard'
            tabName='Dashboard'
            icon={<RiDashboard2Fill size={16} />}
          />

          {/* Profile */}
          {commonPorfileTab()}

          {/* Become Instructor */}
          <NavigationTabs
            hrefLink='/user/become-instructor'
            comparePathName='/user/become-instructor'
            tabName='Become Instructor'
            icon={<AiOutlineTeam size={16} />}
          />
        </>
      ) : null}

      {/* Only For Instructor */}
      {session &&
      status === 'authenticated' &&
      session.user.role.includes('Instructor') ? (
        <>
          {/* Instructor Dashboard */}
          <NavigationTabs
            hrefLink='/instructor/dashboard'
            comparePathName='/instructor/dashboard'
            tabName='Dashboard'
            icon={<RiDashboard2Fill size={16} />}
          />

          {/* Profile */}
          {commonPorfileTab()}

          {/* Instructor Create Courses */}
          <NavigationTabs
            hrefLink='/instructor/course/create'
            comparePathName='/instructor/course/create'
            tabName='Create Courses'
            icon={<AiOutlineCarryOut size={16} />}
          />
        </>
      ) : null}

      {/* Only For Admin */}
      {session &&
      status === 'authenticated' &&
      session.user.role.includes('Admin') ? (
        <>
          {/* Admin Dashboard */}
          <NavigationTabs
            hrefLink='/admin/dashboard'
            comparePathName='/admin/dashboard'
            tabName='Dashboard'
            icon={<RiDashboard2Fill size={16} />}
          />

          {/* Profile */}
          {commonPorfileTab()}

          {/* All Users */}
          <NavigationTabs
            hrefLink='/admin/all-users'
            comparePathName='/admin/all-users'
            tabName='All Users'
            icon={<FaUsers size={16} />}
          />
        </>
      ) : null}

      {/* Images */}
      {session && (
        <NavigationTabs
          hrefLink='/images'
          comparePathName='/images'
          tabName='Gallery'
          icon={<GrGallery size={16} />}
        />
      )}
    </>
  )
}

export default LeftSidebar
