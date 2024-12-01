import { useState, useEffect, useRef } from 'react'
import socket from '../../socket'
import Peer from 'peerjs'
import VideoCallControls from './VideoCallControls'

const IncomingCallHandler = () => {
  const [isCallIncoming, setIsCallIncoming] = useState(false)
  const [isCallAccepted, setIsCallAccepted] = useState(false)
  const [caller, setCaller] = useState(null)
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isCallEnded, setIsCallEnded] = useState(false) // Cờ để ngăn chặn vòng lặp
  const peerRef = useRef(null)

  useEffect(() => {
    const handleIncomingCall = ({ socket_id, peer_id, receiver_id, sender_id }) => {
      console.log('Incoming call from', sender_id)
      setIsCallIncoming(true)
      setCaller({ socket_id, peer_id, receiver_id, sender_id })
    }

    const handleCallEnded = () => {
      if (!isCallEnded) {
        console.log('Call ended by the other party.')
        setIsCallEnded(true) // Đặt cờ để ngăn xử lý lại
        resetCallState()
      }
    }

    // Lắng nghe các sự kiện từ socket
    socket.on('incoming_call', handleIncomingCall)
    socket.on('call_ended', handleCallEnded)

    return () => {
      // Dọn dẹp khi component unmount
      socket.off('incoming_call', handleIncomingCall)
      socket.off('call_ended', handleCallEnded)
    }
  }, [isCallEnded])

  const handleAccept = () => {
    setIsCallAccepted(true)
    setIsCallEnded(false) // Đảm bảo trạng thái kết thúc được đặt lại

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((localStream) => {
      setLocalStream(localStream)

      peerRef.current = new Peer()
      peerRef.current.on('open', (id) => {
        socket.emit('accept_call', {
          receiver_id: caller.receiver_id,
          socket_id: caller.socket_id,
          peer_id: id,
          sender_id: caller.sender_id
        })

        const call = peerRef.current.call(caller.peer_id, localStream)
        call.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream)
        })
      })

      peerRef.current.on('call', (call) => {
        call.answer(localStream)
        call.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream)
        })
      })
    })
  }

  const handleReject = () => {
    socket.emit('reject_call', { sender_id: caller.sender_id, receiver_id: socket.id })
    resetCallState()
  }

  const endCall = () => {
    if (!isCallEnded) {
      setIsCallEnded(true) // Đặt cờ để ngăn gửi sự kiện nhiều lần
      socket.emit('end_call', { receiver_id: caller.sender_id, sender_id: caller.receiver_id })
      if (peerRef.current) {
        peerRef.current.disconnect()
        peerRef.current = null
      }
      resetCallState()
    }
  }

  const resetCallState = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      setLocalStream(null)
    }
    setIsCallIncoming(false)
    setIsCallAccepted(false)
    setRemoteStream(null)
    setCaller(null)

    if (peerRef.current) {
      peerRef.current.destroy()
      peerRef.current = null
    }
  }

  return isCallIncoming ? (
    <div className='fixed top-5 right-5 bg-white shadow-lg rounded-lg p-5 text-center z-50'>
      <p className='text-lg font-semibold text-black'>
        📞 Cuộc gọi đến từ: <span className='font-bold'>{caller.sender_id}</span>
      </p>
      <div className='mt-4 flex justify-center space-x-4'>
        <button onClick={handleAccept} className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600'>
          ✅ Chấp nhận
        </button>
        <button onClick={handleReject} className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600'>
          ❌ Từ chối
        </button>
      </div>
      {isCallAccepted && <VideoCallControls localStream={localStream} remoteStream={remoteStream} endCall={endCall} />}
    </div>
  ) : null
}

export default IncomingCallHandler
