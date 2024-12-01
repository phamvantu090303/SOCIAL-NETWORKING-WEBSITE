import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminDashboard from './AdminDashboard'

function Admin() {
  const [activeComponent, setActiveComponent] = useState('account')

  return (
    <div className='flex gap-3 border-r-2 border-[#000000]'>
      {/* Sidebar */}
      <AdminSidebar setActiveComponent={setActiveComponent} />

      {/* Dashboard */}
      <div className='flex-1 h-screen'>
        <AdminDashboard activeComponent={activeComponent} />
      </div>
    </div>
  )
}

export default Admin
