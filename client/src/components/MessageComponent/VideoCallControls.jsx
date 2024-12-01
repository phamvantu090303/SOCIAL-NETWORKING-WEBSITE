import { useState, useEffect, useRef } from 'react'

const VideoCallControls = ({ localStream, remoteStream, endCall }) => {
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  // Update the video elements with the streams
  useEffect(() => {
    if (localStream) {
      localVideoRef.current.srcObject = localStream
    }
    if (remoteStream) {
      console.log('Remote stream detected in VideoCallControls:', remoteStream)
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [localStream, remoteStream])

  // Toggle mute/unmute audio
  const toggleAudio = () => {
    const audioTracks = localStream?.getAudioTracks() || []
    audioTracks.forEach((track) => {
      track.enabled = !track.enabled
    })
    setIsAudioMuted((prev) => !prev)
  }

  // Toggle mute/unmute video
  const toggleVideo = () => {
    const videoTracks = localStream?.getVideoTracks() || []
    videoTracks.forEach((track) => {
      track.enabled = !track.enabled
    })
    setIsVideoMuted((prev) => !prev)
  }

  return (
    <div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-4 rounded-lg flex flex-col items-center space-y-4 shadow-lg'>
      <div className='flex space-x-4'>
        {/* Mute/Unmute Audio Button */}
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full ${isAudioMuted ? 'bg-red-500' : 'bg-green-500'} hover:bg-opacity-80`}
          aria-label={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isAudioMuted ? 'Unmute' : 'Mute'}
        </button>

        {/* Turn On/Off Video Button */}
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${isVideoMuted ? 'bg-red-500' : 'bg-green-500'} hover:bg-opacity-80`}
          aria-label={isVideoMuted ? 'Turn On Video' : 'Turn Off Video'}
        >
          {isVideoMuted ? 'Turn On Video' : 'Turn Off Video'}
        </button>

        {/* End Call Button */}
        <button onClick={endCall} className='p-3 bg-red-600 rounded-full hover:bg-red-700' aria-label='End Call'>
          End Call
        </button>
      </div>

      {/* Video Streams */}
      <div className='flex justify-between w-full space-x-4'>
        {/* Local Stream */}
        <div className='w-1/2'>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className='w-full rounded-lg shadow-md'
            aria-label='Local Video Stream'
          />
        </div>

        {/* Remote Stream */}
        {remoteStream ? (
          <div className='w-1/2'>
            <video
              ref={remoteVideoRef}
              autoPlay
              className='w-full rounded-lg shadow-md'
              aria-label='Remote Video Stream'
            />
          </div>
        ) : (
          <div className='w-1/2 flex items-center justify-center bg-gray-700 rounded-lg shadow-md text-gray-400'>
            Remote video not available
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoCallControls
