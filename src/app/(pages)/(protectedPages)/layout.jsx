import { LeftSidebar } from '@/components'

export default function UserLayout({ children }) {
  return (
    <div className='min-h-custom flex flex-col md:flex-row'>
      <div className='w-full bg-slate-200 md:w-[250px]'>
        <LeftSidebar />
      </div>
      {children}
    </div>
  )
}
