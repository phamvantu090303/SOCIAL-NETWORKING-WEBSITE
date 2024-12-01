import { useEffect, useState } from 'react' // Đảm bảo bạn import React
import MessageBody from './MessageBody'
import MessageHeader from './MessageHeader'
import { axiosInstance } from '../../axios'

export default function Message() {
  const [receiverId, setReceiverId] = useState('') // ID của người nhận
  const [receiverName, setReceiverName] = useState('') // Tên người nhận
  const [senderId, setSenderId] = useState('') // ID của người gửi
  useEffect(() => {
    const User = async () => {
      try {
        const res = await axiosInstance('/api/me')
        const User = res.data.result._id
        console.log(User)
        setSenderId(User)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    User()
  }, [])
  const handleUserClick = (receiverId, name) => {
    setReceiverId(receiverId)
    setReceiverName(name)
    setSenderId(senderId)
  }

  return (
    <div className='flex h-[100vh] border-x border-[#222222] overflow-hidden'>
      <MessageHeader onClickMessage={handleUserClick} senderId={senderId} /> {/* Truyền senderId vào đây */}
      {receiverId ? (
        <MessageBody receiverId={receiverId} receiverName={receiverName} />
      ) : (
        <div className='flex flex-col w-[470px] 2xl:w-[600px]  items-center justify-center gap-4'>
          <p className='w-[470px] 2xl:w-[600px] text-center xl:text-2xl text-xl text-gray-500 mt-4'>
            Please select a conversation to start chatting.
          </p>
          <button className='bg-sky-500 text-2xl rounded-full hover:bg-sky-600'>New Message</button>
        </div>
      )}
    </div>
  )
}
