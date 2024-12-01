import { useEffect, useState } from 'react'
import NavItem from './NavItem'
import ProfileButton from './ProfileButton'
import { MdOutlinePostAdd } from 'react-icons/md'
import Socket from '../../socket'

const navItems = [
  { icon: '/images/home-icon.svg', text: 'Home', isActive: true, navigate: '/home' },
  { icon: '/images/explore-icon.svg', text: 'Explore', navigate: '/search' },
  { icon: '/images/notifications-icon.svg', text: 'Notifications' },
  { icon: '/images/messages-icon.svg', text: 'Messages', navigate: '/message' },
  { icon: '/images/bookmarks-icon.svg', text: 'Bookmarks', navigate: '/bookmark' },
  { icon: '/images/lists-icon.svg', text: 'Lists' },
  { icon: '/images/profile-icon.svg', text: 'Profile', navigate: '/profile' },
  { icon: '/images/more-icon.svg', text: 'More' }
]

function Sidebar() {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    setSocket(Socket)
  }, [])

  return (
    <nav className='flex flex-col mt-3 max-w-full text-xl font-bold whitespace-nowrap text-neutral-900 xl:w-[275px] w-[40px]'>
      <div className='fixed top-1'>
        <a href='/home'>
          <img loading='lazy' src='/images/VA.svg' alt='Twitter Logo' className='object-contain w-[55px]' />
        </a>
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            icon={item.icon}
            text={item.text}
            isActive={item.isActive}
            navigate={item.navigate}
            count={item.count || 0}
            socket={socket}
          />
        ))}
        <div className='flex flex-col justify-center py-4 text-base font-bold leading-none text-center text-white whitespace-nowrap'>
          <button className='flex flex-col items-center overflow-hidden gap-2.5 self-stretch xl:px-24 xl:py-4 bg-sky-500 rounded-full xl:w-[233px] w-[30px]'>
            <p className='hidden xl:block'>Post</p>
            <MdOutlinePostAdd className='block xl:hidden w-5 h-5' />
          </button>
        </div>
        <ProfileButton />
      </div>
    </nav>
  )
}

export default Sidebar
