import { useEffect, useState, useRef, useCallback } from 'react'
import socket from '../../socket'
import { axiosInstance } from '../../axios'
import { FaRegPaperPlane } from 'react-icons/fa'
import CallButton from './Call'
import IncomingCallHandler from './incoming_call'
import VideoCallControls from './VideoCallControls'

const LIMIT = 10

function MessageBody({ receiverId, receiverName }) {
  const [newMessage, setNewMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [showTimestamp, setShowTimestamp] = useState({})
  const [senderId, setSenderId] = useState('')
  const [senderName, setSenderName] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const messagesEndRef = useRef(null)
  const messageListRef = useRef(null)

  useEffect(() => {
    const fetchSenderInfo = async () => {
      try {
        const response = await axiosInstance.get('/api/me')
        const { _id, name } = response.data.result
        setSenderId(_id)
        setSenderName(name)
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }
    fetchSenderInfo()
  }, [])

  useEffect(() => {
    setChatMessages([])
    setPage(1)
    setHasMore(true)
    setLoading(true)
    fetchMessages()
  }, [receiverId])

  const fetchMessages = useCallback(async () => {
    if (!receiverId) return
    try {
      const response = await axiosInstance.get(`/conversations/receivers/${receiverId}`, {
        params: { limit: LIMIT, page }
      })
      const newMessages = response.data.result.conversations
      if (newMessages.length < LIMIT) setHasMore(false)
      setChatMessages((prev) => [...newMessages.reverse(), ...prev])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
      scrollToBottom()
    }
  }, [receiverId, page])

  useEffect(() => {
    const handleMessageReceived = (payload) => {
      console.log('Message received:', payload)
      const newMessage = {
        content: payload.payload.content,
        timestamp: new Date().toLocaleString(),
        sender_id: payload.payload.sender_id
      }
      setChatMessages((prev) => [...prev, newMessage])
      scrollToBottom()
    }
    socket.on('receive_message', handleMessageReceived)
    return () => {
      socket.off('receive_message', handleMessageReceived)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault()
      if (!newMessage.trim()) return
      const timestamp = new Date().toLocaleString()
      const conversation = {
        content: newMessage,
        sender_id: senderId,
        receiver_id: receiverId,
        sender_name: senderName,
        _id: new Date().getTime().toString(),
        timestamp
      }
      socket.emit('send_message', { payload: conversation })
      setChatMessages((prev) => [...prev, conversation])
      setNewMessage('')
      scrollToBottom()
    },
    [newMessage, senderId, receiverId, senderName]
  )

  const handleScroll = () => {
    if (messageListRef.current && messageListRef.current.scrollTop === 0) {
      if (hasMore && !loading) {
        setPage((prevPage) => prevPage + 1)
      }
    }
  }

  const toggleTimestamp = (id) => {
    setShowTimestamp((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className='relative flex flex-col justify-between w-[600px] lg:w-[450px] h-auto overflow-hidden bg-slate-100 text-white'>
      <div className='flex flex-col h-[90%]'>
        <div className='flex items-center justify-between p-3 border-b border-gray-600'>
          <h1 className='text-3xl font-semibold hover:bg-yellow-50 text-black'>{receiverName}</h1>
          <CallButton receiverId={receiverId} senderId={senderId} />
        </div>
        <div
          className='flex-1 lg:max-h-[600px] overflow-y-auto p-2 scrollbar-chatbox'
          ref={messageListRef}
          onScroll={handleScroll}
        >
          {loading ? (
            <p className='text-black text-lg'>Đang tải tin nhắn...</p>
          ) : chatMessages.length > 0 ? (
            chatMessages.map((conversation, index) => (
              <div
                key={conversation._id || index}
                className={`flex ${conversation.sender_id === senderId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  onClick={() => toggleTimestamp(conversation._id)}
                  className={`${
                    conversation.sender_id === senderId ? 'bg-blue-500' : 'bg-gray-700'
                  } text-white p-3 my-1 rounded-2xl max-w-[80%] break-words`}
                >
                  <p className='text-base rounded-s-full'>{conversation.content}</p>
                  {showTimestamp[conversation._id] && (
                    <p className='text-base text-gray-400'>{conversation.timestamp}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className='text-center text-black text-xl'>Không có tin nhắn nào!</p>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className='flex items-center justify-between p-2 bg-gray-800 text-white rounded-b-xl'>
        <input
          type='text'
          placeholder='Nhắn tin ...'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className='w-full px-4 py-2 text-gray-700 rounded-full focus:outline-none'
        />
        <button onClick={handleSendMessage} className='text-xl ml-2 text-blue-500'>
          <FaRegPaperPlane />
        </button>
      </div>
      {/* <VideoCallControls receiverId={receiverId} /> */}
      <IncomingCallHandler />
    </div>
  )
}

export default MessageBody
