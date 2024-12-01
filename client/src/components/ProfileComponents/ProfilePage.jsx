import { IoMdArrowRoundBack } from 'react-icons/io'
import { FaBellSlash, FaCalendarAlt, FaEnvelope, FaLink, FaMapMarkerAlt, FaRegBell } from 'react-icons/fa'
import { useEffect, useState } from 'react'

import { LuMoreHorizontal } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../axios'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [profilePage, setProfilePage] = useState()
  const [Follow, setFollow] = useState(false)
  const handleFollow = () => {
    setFollow(!Follow)
  }
  const [notify, setNotify] = useState(false)
  const handleNotify = () => {
    setNotify(!notify)
  }
  useEffect(() => {
    const fetchSenderInfo = async () => {
      try {
        axiosInstance.get('api/list/users').then((res) => {
          setProfilePage(
            res.data.result.map((v) => {
              return {
                name: v.name,
                email: v.email,
                date_of_birth: v.date_of_birth,
                avatar: v.avatar,
                created_at: v.created_at
              }
            })
          )
        })
      } catch (err) {
        console.log('loi data ', err.data)
      }
    }
    fetchSenderInfo()
  }, [])

  return (
    <div className='w-[613px] border-l border-r border-[#2f3336]'>
      {profilePage.map((v) => (
        <div key={v.id}>
          <div className='flex items-center px-4 py-2 border-b border-[#2f3336]'>
            <IoMdArrowRoundBack className='mr-5 cursor-pointer text-white p-2 hover:bg-[#2f3336] rounded-full' />
            <div>
              <h2 className='text-lg font-bold leading-6 text-white'>{v.name}</h2>
              <span className='text-sm text-[#6e767d]'>1 post</span>
            </div>
          </div>
          <div className='relative bg-[#494b4b] h-[200px] overflow-hidden'>
            <img src={v.avatar} className='w-full object-cover' />
          </div>
          <div className='p-4 relative'>
            <img
              src={v.avatar}
              alt='Avatar'
              className='w-[134px] h-[134px] rounded-full border-4 border-black absolute top-[-75px] left-4'
            />
            <h1 className='mt-[85px] mb-0 text-lg font-bold leading-6 text-white'>{v.name}</h1>
            <p className='text-[#6e767d] mt-1 text-sm leading-5'>{v.email}</p>
            <p className='text-[#6e767d] mt-4'>You’re gonna leave here in a whole lot of pain 😣</p>
            <div className='flex flex-wrap gap-4 mt-4 text-[#6e767d] text-sm leading-3'>
              <span className='flex items-center gap-1'>
                <FaMapMarkerAlt /> Follow my new account
              </span>
              <span className='flex items-center gap-1'>
                <FaLink />{' '}
                <a href='http://vuighe.net' className='text-[#1da1f2]'>
                  http://vuighe.net
                </a>
              </span>
              <span className='flex items-center gap-1'>
                <FaCalendarAlt /> {v.created_at}
              </span>
            </div>
          </div>
          <div className='flex gap-5 mt-4 text-sm leading-3'>
            <span className='text-[#6e767d]'>
              <strong className='text-white'>200</strong> Following
            </span>
            <span className='text-[#6e767d]'>
              <strong className='text-white'>100</strong> Followers
            </span>
          </div>

          <div className='absolute flex gap-2 top-3 right-4'>
            <div className='relative flex flex-col items-center'>
              <LuMoreHorizontal className='w-5 h-5 p-1 border border-white rounded-full cursor-pointer' />
              <span className='absolute top-10 right-0 px-1 bg-[#6e767d] text-white text-xs opacity-0 invisible transition-opacity duration-200'>
                More
              </span>
            </div>
            <div className='relative flex flex-col items-center'>
              <FaEnvelope className='w-5 h-5 p-1 border border-white rounded-full cursor-pointer' />
              <span className='absolute top-10 right-0 px-1 bg-[#6e767d] text-white text-xs opacity-0 invisible transition-opacity duration-200'>
                Message
              </span>
            </div>
            <div className='relative flex flex-col items-center'>
              {notify ? (
                <FaRegBell className='w-5 h-5 p-1 border border-white rounded-full cursor-pointer' />
              ) : (
                <FaBellSlash className='w-5 h-5 p-1 border border-white rounded-full cursor-pointer' />
              )}
              <span className='absolute top-10 right-0 px-1 bg-[#6e767d] text-white text-xs opacity-0 invisible transition-opacity duration-200'>
                {notify ? 'Notify' : 'Turn off Notify'}
              </span>
            </div>
            <button className='px-7 py-1 rounded-full font-bold text-sm leading-5 hover:bg-[#d3d3d3]'>Follow</button>
          </div>
        </div>
      ))}
    </div>
  )
}
