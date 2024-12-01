import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import RightSidebar from './RightSidebar'
import { useAuth } from '../../store'

function Layout({ children }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() // Lấy đường dẫn hiện tại

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate]) // Thêm user và navigate vào dependencies array

  const isMessagePage = location.pathname === '/message' // Kiểm tra nếu là trang Message
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <div className='relative flex justify-center w-full mx-auto gap-10 items-start bg-white'>
      {!isAdminPage && <Sidebar />}
      {children}
      {!isAdminPage && !isMessagePage && <RightSidebar />}
    </div>
  )
}

export default Layout
