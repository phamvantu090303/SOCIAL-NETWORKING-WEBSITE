import { IoSettingsOutline } from 'react-icons/io5'
import { TbMessagePlus } from 'react-icons/tb'
import { useEffect, useState } from 'react'
import { axiosInstance } from '../../axios'
import socket from '../../socket'

export default function MessageHeader({ onClickMessage, senderId }) {
  const [userList, setUserList] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/api/listUsers/')
        const users = res.data.result.map((user) => ({
          id: user._id,
          name: user.name,
          avatar: user.avatar,
          handle: '@' + user.username,
          hasUnread: false
        }))
        setUserList(users)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    socket.on('message_read', ({ conversation_id }) => {
      setUserList((prevList) =>
        prevList.map((user) => (user.id === conversation_id ? { ...user, hasUnread: false } : user))
      )
    })
    return () => {
      socket.off('message_read')
    }
  }, [])

  const handleUserClick = (user) => {
    onClickMessage(user.id, user.name)
    setUserList((prevList) => prevList.map((u) => (u.id === user.id ? { ...u, hasUnread: false } : u)))
  }

  return (
    <div className='lg:w-[456px] w-[300px] border-r border-[#222222]'>
      <div className='flex justify-between items-center p-4 bg-slate-200'>
        <p className='text-black text-3xl font-semibold'>Messages</p>
        <div className='flex cursor-pointer text-white'>
          <button className='p-0'>
            <IoSettingsOutline className='p-2 w-[40px] h-[40px] text-black hover:bg-[#f2f2f2] rounded-full' />
          </button>
          <button className='p-0'>
            <TbMessagePlus className='p-2 w-[40px] h-[40px] text-black hover:bg-[#f2f2f2] rounded-full' />
          </button>
        </div>
      </div>
      <div className='w-full'>
        {userList.length > 0 ? (
          userList.map((user) => (
            <div
              key={user.id}
              className='flex gap-5 px-3 items-center py-3 hover:bg-slate-100 cursor-pointer'
              onClick={() => handleUserClick(user)}
            >
              <img
                src={user.avatar}
                alt={`${user.name}'s avatar`}
                className='w-[40px] h-[40px] rounded-full object-contain'
              />
              <div className='flex flex-col'>
                <p className='text-black font-medium text-base'>{user.name}</p>
                {user.hasUnread && <span className='text-red-500 text-sm'>Unread messages</span>}
              </div>
            </div>
          ))
        ) : (
          <p className='text-[#71767b]'>No users found.</p>
        )}
      </div>
      <p className='mt-4 text-[15px] text-[#71767b]'>
        Drop a line, share posts, and more with private conversations between you and others on X.
      </p>
    </div>
  )
}
