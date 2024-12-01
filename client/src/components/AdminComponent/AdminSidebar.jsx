import { useAuth } from '../../store'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaHashtag, FaRegUser } from 'react-icons/fa'
import { MdContentPaste, MdOutlineReport, MdOutlineAdminPanelSettings } from 'react-icons/md'
import { IoIosLogOut, IoIosNotifications } from 'react-icons/io'

export default function AdminSidebar({ setActiveComponent }) {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (component) => location.pathname.includes(component)
  return (
    <aside className='h-screen flex flex-col justify-between w-1/6 bg-gray-800 text-gray-300 border-r '>
      <div>
        <div className='flex gap-5 items-center mb-8'>
          <img loading='lazy' src='/images/VA.svg' alt='' className='w-[60px] h-[60px] object-contain' />
          <h1 className='text-2xl font-bold '>Admin</h1>
        </div>
        <nav className=' flex flex-col justify-between'>
          <ul className='space-y-4'>
            <li
              className={`font-medium cursor-pointer p-3 rounded flex items-center gap-3 ${
                isActive('AccCount') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => setActiveComponent('account')}
            >
              <FaRegUser />
              <p>AdminManageAccount</p>
            </li>
            <li
              className={`font-medium cursor-pointer p-3 rounded flex items-center gap-3 ${
                isActive('hashtag') ? 'bg-gray-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => setActiveComponent('hashtag')}
            >
              <FaHashtag />
              <p>AdminManageHashtag</p>
            </li>
            <li
              className={`font-medium cursor-pointer p-3 rounded flex items-center gap-3 ${
                isActive('tweet') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => setActiveComponent('post')}
            >
              <MdContentPaste className='text-xl' />
              <p>AdminManageTweet</p>
            </li>
            <li
              className={`font-medium cursor-pointer p-3 rounded flex items-center gap-3 ${
                isActive('report') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => setActiveComponent('report')}
            >
              <MdOutlineReport className='text-xl' />
              AdminManageReport
            </li>
            <li
              className={`font-medium cursor-pointer p-3 rounded flex items-center gap-3 ${
                isActive('user') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => setActiveComponent('user')}
            >
              <MdOutlineAdminPanelSettings className='text-xl' />
              AdminUser
            </li>
            <li className='font-medium cursor-pointer p-3 rounded flex items-center gap-3'>
              <IoIosNotifications className='text-xl' />
              Notifications
            </li>
          </ul>
        </nav>
      </div>
      <div className='p-3'>
        <button
          onClick={() => {
            navigate('/login')
          }}
          className='text-xl bg-gray-700'
        >
          <IoIosLogOut className='text-xl ' />
        </button>
      </div>
    </aside>
  )
}
