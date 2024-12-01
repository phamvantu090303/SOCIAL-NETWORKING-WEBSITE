import { useState, useEffect } from 'react'
import { axiosInstance } from '../../axios'
import SearchBar from './SearchBar'

function AdminManagePost() {
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [detailTweet, setDetailTweet] = useState(null)
  const [searchPost, setSearchPost] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await axiosInstance.get('/admin/tweets')
        setTweets(response.data.data.data)
        setSearchPost(response.data.data.data)
      } catch (err) {
        setError('Failed to load tweets. Please try again later.', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTweets()
    const interval = setInterval(() => {
      fetchTweets()
    }, 30000)
    return () => {
      clearInterval(interval)
      setTweets([])
      setSearchPost([])
    }
  }, [])

  const handleSearch = (searchItem) => {
    const filtered = tweets.filter((item) => item._id.toLowerCase().includes(searchItem.toLowerCase().trim()))
    setSearchPost(searchItem.trim() ? filtered : tweets)
    setCurrentPage(1)
  }

  const handleViewDetail = async (tweetId) => {
    try {
      const response = await axiosInstance.post(`/admin/detail/${tweetId}`)
      setDetailTweet(response.data.result.result)
    } catch (err) {
      setError('Failed to load tweet details.', err)
    }
  }

  const handleDeleteTweet = async (tweetId) => {
    try {
      await axiosInstance.delete(`/admin/delete/${tweetId}`)
      setTweets((prevTweets) => prevTweets.filter((tweet) => tweet._id !== tweetId))
      alert('Tweet deleted successfully')
    } catch (err) {
      alert('Failed to delete tweet.', err)
    }
  }

  const totalPages = Math.ceil(searchPost.length / itemsPerPage)
  const currentData = searchPost.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full' role='status'></div>
        <span className='ml-4 text-gray-500'>Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-red-500 text-lg'>{error}</p>
      </div>
    )
  }

  return (
    <div className='flex h-screen bg-gray-100 gap-3'>
      <div className='w-full bg-white p-6 rounded-lg shadow-lg text-black'>
        <h1 className='text-2xl font-bold mb-4'>Post Management</h1>
        <SearchBar onSearch={handleSearch} />
        <table className='min-w-full border-collapse border border-gray-300 mt-8'>
          <thead>
            <tr>
              <th className='border border-gray-300 p-2'>ID</th>
              <th className='border border-gray-300 p-2'>Content</th>
              <th className='border border-gray-300 p-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((tweet) => (
                <tr key={tweet._id}>
                  <td className='border border-gray-300 p-2'>{tweet._id}</td>
                  <td className='border border-gray-300 p-2'>{tweet.content}</td>
                  <td className='border border-gray-300 p-2 flex justify-center gap-2'>
                    <button
                      className='bg-green-500 text-white hover:bg-green-600'
                      onClick={() => handleViewDetail(tweet._id)}
                    >
                      Detail
                    </button>
                    <button
                      className='bg-red-500 text-white hover:bg-red-600'
                      onClick={() => handleDeleteTweet(tweet._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='3' className='text-center border border-gray-300 p-2'>
                  No tweets available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className='flex justify-center mt-4'>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`p-2 mx-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
          >
            Previous
          </button>
          <span className='p-2'>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 mx-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
          >
            Next
          </button>
        </div>
      </div>
      {detailTweet && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white rounded-lg shadow-lg p-6 w-1/3'>
            <h2 className='text-xl font-bold mb-4 text-center text-gray-800'>Chi tiết báo cáo</h2>
            <div className='space-y-2 text-gray-600'>
              <p>
                <strong>ID:</strong> {detailTweet._id}
              </p>
              <div className='bg-slate-200'>
                <h1 className='text-2xl text-red-700'>Chi tiết:</h1>
                <div>
                  <div className='flex gap-2 items-center'>
                    {/* <img
                      src={detailTweet.userTweet.avatar || '/images/user-avatar.jpg'}
                      alt=''
                      className='h-[48px] w-[48px] rounded-full'
                    /> */}
                    <h2 className='text-black'>
                      <strong>User ID :</strong> {detailTweet.user_id}
                    </h2>
                    <p></p>
                  </div>
                  <div className='mt-3'>
                    <p className='text-xl text-black'>
                      <strong>Status : </strong>
                      {detailTweet.content}{' '}
                    </p>
                    {detailTweet.medias?.length > 0 &&
                      detailTweet.medias.map((media, index) => (
                        <div key={index}>
                          {media.type === 0 && (
                            <img src={media.url} alt={`media-${index}`} className='w-full max-h-[400px] rounded-lg' />
                          )}
                          {media.type === 1 && (
                            <video src={media.url} controls className='w-full max-h-[400px] rounded-lg'></video>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <button
              className='text-white bg-red-500 py-2 px-4 rounded-lg mt-4 w-full'
              onClick={() => setDetailTweet(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminManagePost
