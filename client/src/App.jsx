import { RouterProvider } from 'react-router-dom'
import './App.css'
import router from './router'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    const controller = new AbortController()

    return () => {
      controller.abort()
    }
  }, [])

  return <RouterProvider router={router} />
}

export default App
