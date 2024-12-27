'use server'

import Link from 'next/link'
import React from 'react'
import { AiOutlineCarryOut, AiOutlineTeam } from 'react-icons/ai'
import { MdAccountCircle } from 'react-icons/md'
import { RiDashboard2Fill } from 'react-icons/ri'
import { FaUsers } from 'react-icons/fa'
import { GrGallery } from 'react-icons/gr'
import { NavigationTabs } from '@/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

const LeftSidebar = async () => {
  const session = await getServerSession(authOptions)

  // Profile Tab
  const commonPorfileTab = () => (
    <NavigationTabs
      hrefLink='/profile'
      tabName='Profile'
      icon={<MdAccountCircle size={18} />}
    />
  )

  return (
    <>
      {/* Only For Subscriber */}
      {session && session.user.role === 'Subscriber' ? (
        <>
          {/* User Dashboard */}
          <NavigationTabs
            hrefLink='/user/dashboard'
            tabName='Dashboard'
            icon={<RiDashboard2Fill size={18} />}
          />

          {/* Profile */}
          {commonPorfileTab()}

          {/* Become Instructor */}
          <NavigationTabs
            hrefLink='/user/become-instructor'
            tabName='Become Instructor'
            icon={<AiOutlineTeam size={18} />}
          />
        </>
      ) : null}

      {/* Only For Instructor */}
      {session && session.user.role === 'Instructor' ? (
        <>
          {/* Instructor Dashboard */}
          <NavigationTabs
            hrefLink='/instructor/dashboard'
            tabName='Dashboard'
            icon={<RiDashboard2Fill size={18} />}
          />

          {/* Profile */}
          {commonPorfileTab()}

          {/* Instructor Create Courses */}
          <NavigationTabs
            hrefLink='/instructor/course/create'
            tabName='Create Courses'
            icon={<AiOutlineCarryOut size={18} />}
          />
        </>
      ) : null}

      {/* Only For Admin */}
      {session && session.user.role === 'Admin' ? (
        <>
          {/* Admin Dashboard */}
          <NavigationTabs
            hrefLink='/admin/dashboard'
            tabName='Dashboard'
            icon={<RiDashboard2Fill size={18} />}
          />

          {/* Profile */}
          {commonPorfileTab()}

          {/* All Users */}
          <NavigationTabs
            hrefLink='/admin/all-users'
            tabName='All Users'
            icon={<FaUsers size={18} />}
          />
        </>
      ) : null}

      {/* Images */}
      {session && (
        <NavigationTabs
          hrefLink='/images'
          tabName='Gallery'
          icon={<GrGallery size={18} />}
        />
      )}
    </>
  )
}

export default LeftSidebar
