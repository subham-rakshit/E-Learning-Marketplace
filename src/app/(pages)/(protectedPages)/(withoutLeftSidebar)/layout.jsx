import { LeftSidebar, ProtectedRoutesTopbar } from '@/components'

export default function UserLayoutWithoutLeftSidebar({ children }) {
  return (
    <>
      <ProtectedRoutesTopbar />
      {children}
    </>
  )
}
