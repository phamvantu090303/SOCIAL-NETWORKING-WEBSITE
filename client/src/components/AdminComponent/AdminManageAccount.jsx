import { useEffect, useState } from 'react'
import { axiosInstance } from '../../axios'
import SearchBar from './SearchBar'

export default function AdminManageAccount() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filteredAccount, setFilteredAccount] = useState([])
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axiosInstance.get('/admin/AccCount')
        setAccounts(response.data.result.data)
        setFilteredAccount(response.data.result.data)
      } catch (error) {
        setError('Failed to load accounts ', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAccounts()
  }, [])
  const handleSearch = (searchTerm) => {
    const filtered = accounts.filter(
      (item) =>
        item.username.toLowerCase().trim().includes(searchTerm.toLowerCase().trim()) ||
        item.email.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
    )
    if (!searchTerm.trim()) {
      setFilteredAccount(accounts)
    } else {
      setFilteredAccount(filtered)
    }
  }

  return (
    <div className='flex h-full bg-gray-100 gap-3'>
      <section className='w-full bg-white p-6 rounded-lg shadow-lg text-black'>
        <h2 className='text-2xl font-bold mb-4'>Account Management</h2>
        <SearchBar onSearch={handleSearch} />
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className='text-red-500'>{error}</p>
        ) : (
          <table className='min-w-full border-collapse mt-8'>
            <thead>
              <tr>
                <th className='border p-2 text-left'>ID</th>
                <th className='border p-2 text-left'>Username</th>
                <th className='border p-2 text-left'>Email</th>
                <th className='border p-2 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccount.length > 0 ? (
                filteredAccount.map((account) => (
                  <tr key={account._id}>
                    <td className='border p-2'>{account._id}</td>
                    <td className='border p-2'>{account.username}</td>
                    <td className='border p-2'>{account.email}</td>
                    <td className='border p-2 flex justify-center gap-2'>
                      <button className='bg-green-500 text-white hover:bg-green-600'>Detail</button>
                      <button className='bg-red-500 text-white hover:bg-red-600'>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='4' className='text-center border p-2'>
                    No accounts available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
