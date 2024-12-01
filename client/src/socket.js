import { io } from 'socket.io-client'

// Kết nối với server qua socket.io
const socket = io(import.meta.env.VITE_API_URL, {
  auth: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  }
})

export default socket
