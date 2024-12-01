import { useState } from 'react'
import { axiosInstance } from '../../axios'

function Report({ onClose, tweetID }) {
  const [content, setContent] = useState('') // Store the selected reason
  const [customReason, setCustomReason] = useState('') // Store custom reason when 'Lý do khác' is selected
  const [showDetails, setShowDetails] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    // Check if content is empty and alert the user if no reason is selected
    if (content === '') {
      alert('Hãy chọn lý do báo cáo')
    } else {
      const reportContent = content === 'Lý do khác' ? customReason : content
      try {
        await axiosInstance.post('/report', {
          tweet_id: tweetID,
          contents_of_the_report: reportContent
        })
        alert('Báo cáo đã được gửi')
        onClose() // Close the modal after submission
      } catch (err) {
        console.error(err)
        alert('Có lỗi xảy ra khi gửi báo cáo')
      }
    }
  }

  const handleReasonChange = (e) => {
    const selectedReason = e.target.value
    setContent(selectedReason)
    setShowDetails(selectedReason === 'Lý do khác') // Show details if 'Lý do khác' is selected
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000] w-auto h-full overflow-hidden'>
      <div className='bg-white rounded-lg p-6 w-96'>
        <h2 className='text-xl font-semibold mb-4 text-black'>Báo cáo Tweet</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor='reason' className='block text-sm font-medium text-black mb-2'>
            Lý do báo cáo
          </label>
          <select
            id='reason'
            className='w-full p-2 border bg-white text-black border-gray-300 rounded-md mb-4'
            value={content}
            onChange={handleReasonChange}
            required
          >
            <option value=''>Chọn lý do</option>
            <option value='Lừa đảo'>Lừa đảo</option>
            <option value='Hoạt động bất hợp pháp'>Hoạt động bất hợp pháp</option>
            <option value='Thông tin sai lệch'>Thông tin sai lệch</option>
            <option value='Lý do khác'>Lý do khác</option>
          </select>

          {/* Show details if 'Lý do khác' is selected */}
          {showDetails && (
            <>
              <label htmlFor='details' className='block text-sm font-medium text-black mb-2'>
                Chi tiết
              </label>
              <textarea
                id='details'
                className='w-full p-2 border bg-white text-black border-gray-300 rounded-md mb-4'
                rows='4'
                placeholder='Mô tả chi tiết (tùy chọn)'
                value={customReason} // Use customReason for the text input
                onChange={(e) => setCustomReason(e.target.value)} // Update customReason on input change
              ></textarea>
            </>
          )}

          <div className='flex justify-end space-x-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-500 border border-gray-300 rounded-md'
            >
              Hủy
            </button>
            <button type='submit' className='px-4 py-2 bg-blue-500 text-white rounded-md'>
              Gửi báo cáo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Report
