import { useState } from 'react'

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    onSearch(e.target.value) // Truyền giá trị tìm kiếm lên component cha
  }

  return (
    <div className='flex items-center bg-gray-300  px-3 py-1 w-1/3 shadow-sm'>
      <input
        type='text'
        placeholder='Search'
        className='bg-gray-300 outline-none text-black w-full'
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button className='px-1'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5 text-gray-500'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z'
          />
        </svg>
      </button>
    </div>
  )
}
export default SearchBar
