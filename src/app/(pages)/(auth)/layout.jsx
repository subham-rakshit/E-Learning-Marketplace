import { LeftSidebar, AuthRoutesTopbar } from '@/components'

export default function AuthLayout({ children }) {
  return (
    <>
      <AuthRoutesTopbar />
      {children}
    </>
  )
}
