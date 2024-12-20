'use client'

import React from 'react'
import { IoLogOutOutline } from 'react-icons/io5'
import { MdAccountCircle } from 'react-icons/md'
import { signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

const Dropdown = () => {
  const { data: session } = useSession()

  const onLogout = async () => {
    await signOut({
      callbackUrl: '/login'
    })
  }

  if (session) {
    return (
      <>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className='ml-auto'>
            <Avatar>
              <AvatarImage
                src={session ? session.user.image : ''}
                alt={session ? session.user.name : ''}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel className='flex flex-col font-poppins-rg text-[13px] text-slate-800'>
              <span>{session ? session.user.name : ''}</span>
              <span className='text-[11px] text-slate-500'>
                {session ? session.user.email : ''}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <Link href='/user'>
              <DropdownMenuItem className='flex h-full cursor-pointer items-center gap-3 font-poppins-rg text-[15px] text-slate-700'>
                <MdAccountCircle size={16} />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem
              className='flex h-full cursor-pointer items-center gap-3 font-poppins-rg text-[15px] text-slate-700'
              onClick={onLogout}
            >
              <IoLogOutOutline size={16} />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  } else {
    return null
  }
}

export default Dropdown
