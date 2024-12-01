import AdminManageHastag from './AdminManageHastag'
import AdminManagePost from './AdminManagePost'
import AdminManageAccount from './AdminManageAccount'
import AdminManageReport from './AdminManageReport'
import AccountAdmin from './AccountAdmin'

function AdminDashboard({ activeComponent }) {
  const renderComponent = () => {
    switch (activeComponent) {
      case 'hashtag':
        return <AdminManageHastag />
      case 'post':
        return <AdminManagePost />
      case 'account':
        return <AdminManageAccount />
      case 'report':
        return <AdminManageReport />
      case 'user':
        return <AccountAdmin />
      default:
        return <AdminManageAccount />
    }
  }

  return (
    <div className='bg-white'>
      <div>{renderComponent()}</div>
    </div>
  )
}

export default AdminDashboard
