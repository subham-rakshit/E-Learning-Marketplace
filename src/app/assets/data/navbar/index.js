import { AiOutlineAppstore } from 'react-icons/ai'
import { IoLogInOutline } from 'react-icons/io5'
import { TiUserAddOutline } from 'react-icons/ti'

const navLinksData = [
  {
    id: 'nav-link-1',
    name: 'App',
    navLink: '/',
    icon: <AiOutlineAppstore size={16} />
  },
  {
    id: 'nav-link-2',
    name: 'Login',
    navLink: '/login',
    icon: <IoLogInOutline size={16} />
  },
  {
    id: 'nav-link-3',
    name: 'Register',
    navLink: '/register',
    icon: <TiUserAddOutline size={16} />
  }
]

export { navLinksData }
