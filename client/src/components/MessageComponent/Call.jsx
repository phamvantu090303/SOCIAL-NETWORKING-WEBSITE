import { useState, useRef, useEffect } from 'react'
import socket from '../../socket'
import Peer from 'peerjs'
import VideoCallControls from './VideoCallControls'

const CallButton = ({ receiverId, senderId }) => {
  const peerRef = useRef(null)
  const localStreamRef = useRef(null)
  const [isCallActive, setIsCallActive] = useState(false)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isCalling, setIsCalling] = useState(false)

  const initializePeerAndStartCall = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localStreamRef.current = localStream

      const myVideo = document.getElementById('myVideo')
      if (myVideo) myVideo.srcObject = localStream

      peerRef.current = new Peer()
      console.log('Peer created:', peerRef.current)

      peerRef.current.on('open', (peerId) => {
        console.log('Peer ID:', peerId)
        socket.emit('register_peer', { peer_id: peerId, receiver_id: receiverId, sender_id: senderId })
        socket.emit('start_call', { peer_id: peerId, receiver_id: receiverId, sender_id: senderId })
        setIsCallActive(true)
        setIsCalling(true)

        const call = peerRef.current.call(peerId, localStream)
        console.log('Calling peer:', call)
        call.on('stream', (remoteStream) => {
          console.log('Received remote stream:', remoteStream)
          setRemoteStream(remoteStream)
        })
      })

      peerRef.current.on('call', (call) => {
        console.log('Incoming call:', call)
        call.answer(localStream)
        call.on('stream', (remoteStream) => {
          console.log('Received remote stream:', remoteStream)
          setRemoteStream(remoteStream)
        })
      })
    } catch (error) {
      console.error('Error accessing media devices:', error)
      alert('Không thể truy cập thiết bị. Vui lòng kiểm tra quyền truy cập camera và micro.')
    }
  }

  const handleCall = () => {
    if (!peerRef.current) initializePeerAndStartCall()
  }

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }
    if (peerRef.current) {
      peerRef.current.disconnect()
      peerRef.current = null
    }
    socket.emit('end_call', { receiver_id: receiverId, sender_id: senderId })
    setIsCallActive(false)
    setRemoteStream(null)
    setIsCalling(false)
  }
  useEffect(() => {
    const handleEndCall = () => {
      console.log('Call ended by the other party.')
      endCall()
    }
    socket.on('call_ended', handleEndCall)
    return () => {
      socket.off('call_ended', handleEndCall)
    }
  }, [])
  return (
    <div className='p-4'>
      {!isCallActive && (
        <button
          onClick={handleCall}
          className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition'
          disabled={isCalling}
        >
          {isCalling ? 'Đang gọi...' : 'Bắt đầu cuộc gọi'}
        </button>
      )}

      {isCallActive && (
        <div>
          <VideoCallControls
            peerRef={peerRef}
            localStream={localStreamRef.current}
            remoteStream={remoteStream}
            endCall={endCall}
          />
        </div>
      )}
    </div>
  )
}

export default CallButton
