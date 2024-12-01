import { Form } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  return (
    <div className='flex overflow-hidden gap-4 px-4 py-2.5 w-full text-base font-medium tracking-normal bg-gray-200 rounded-[99999px] text-slate-500'>
      <img
        loading='lazy'
        src='/images/search-icon.svg'
        alt=''
        className='object-contain shrink-0 aspect-square w-[19px]'
      />
      <label htmlFor='searchTwitter' className='sr-only'>
        Search Twitter
      </label>
      <Form
        onFinish={() => {
          console.log(searchQuery)
          navigate('/search?q=' + searchQuery)
          setSearchQuery('')
        }}
      >
        <input
          type='text'
          id='searchTwitter'
          placeholder='Search Twitter'
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
          }}
          className='flex-auto w-[278px] bg-transparent border-none outline-none'
        />
      </Form>
    </div>
  )
}
export default SearchBar
