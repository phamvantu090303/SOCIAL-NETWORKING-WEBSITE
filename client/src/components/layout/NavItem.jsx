import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

NavItem.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  navigate: PropTypes.string,
  count: PropTypes.number,
  socket: PropTypes.object
}

NavItem.defaultProps = {
  isActive: false,
  navigate: '',
  count: 0
}

function NavItem({ icon, text, isActive, navigate, count, socket }) {
  const navigateTo = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [notificationCount, setNotificationCount] = useState(count)

  useEffect(() => {
    if (socket) {
      socket.on('getNotification', (data) => {
        setNotifications((prev) => [...prev, data])
        setNotificationCount((prev) => prev + 1) // Tăng số lượng thông báo
      })
    }
    return () => {
      socket && socket.off('getNotification')
    }
  }, [socket])

  const handleClick = () => {
    if (text === 'Notifications') {
      setNotificationCount(0)
      navigateTo('/notifications')
    } else if (navigate) {
      navigateTo(navigate)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`flex cursor-pointer overflow-hidden gap-5 px-2.5 2xl:py-4 py-3 w-full ${isActive ? 'text-sky-500' : ''}`}
    >
      <img loading='lazy' src={icon} alt={`${text} icon`} className='object-contain shrink-0 aspect-square w-[30px]' />
      <div className='hidden xl:block grow shrink my-auto'>{text}</div>
      {notificationCount > 0 && text === 'Notifications' && (
        <div className='ml-auto bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center'>
          {notificationCount}
        </div>
      )}
    </div>
  )
}

export default NavItem
