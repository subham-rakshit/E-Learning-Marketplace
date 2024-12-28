import { LeftSidebar, ProtectedRoutesTopbar } from '@/components'

export default function UserLayoutWithLeftSidebar({ children }) {
  return (
    <>
      <ProtectedRoutesTopbar />
      <div className='min-h-custom flex flex-col md:flex-row'>
        <div className='mb-2 flex w-full flex-wrap md:mb-0 md:mr-3 md:w-[250px] md:flex-col md:pl-2'>
          <LeftSidebar />
        </div>
        {children}
      </div>
    </>
  )
}
