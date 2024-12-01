import { useAuth } from '../../store'
import { Select, Upload } from 'antd'
import { axiosInstance } from '../../axios'
import { useState } from 'react'

function TweetComposer({ setReload, reload }) {
  const [tweetContent, setTweetContent] = useState('')
  const [fileList, setFileList] = useState([])
  const [hashtag, setHashtag] = useState([])

  const { user } = useAuth()

  const handleChange = (info) => {
    setFileList(info.fileList)
  }
  const handlePost = async () => {
    try {
      let medias = []
      for (const v of fileList) {
        const formData = new FormData()

        if (v.type.includes('image')) {
          formData.append('image', v.originFileObj)
          const res = await axiosInstance.post('/medias/upload-image', formData)
          medias = [...medias, ...res.data.result]
        }
        if (v.type.includes('video')) {
          formData.append('video', v.originFileObj)
          const res = await axiosInstance.post('/medias/upload-video', formData)
          medias = [...medias, ...res.data.result]
        }
      }
      await axiosInstance.post('/tweets', {
        medias,
        type: 0,
        audience: 0,
        content: tweetContent,
        hashtags: hashtag, // tên của hashtag dạng ['javascript', 'reactjs']
        mentions: [], // user_id[]
        parent_id: null
      })
      setReload(!reload)
      setTweetContent('')
      setFileList([])
      setHashtag([])
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='flex flex-col justify-center px-4 py-2.5 w-full'>
      <div className='flex flex-col w-full max-md:max-w-full'>
        <div className='flex gap-3 self-start text-xl font-medium tracking-tight text-slate-500'>
          <img
            loading='lazy'
            src={user?.covver_photo || '/images/user-avatar.jpg'}
            alt='User Avatar'
            className='object-contain shrink-0 aspect-square rounded-[99999px] w-[49px]'
          />
          <label htmlFor='tweetInput' className='sr-only'>
            What's happening?
          </label>
          <input
            id='tweetInput'
            type='text'
            value={tweetContent}
            onChange={(e) => {
              setTweetContent(e.target.value)
            }}
            placeholder="What's happening?"
            className='my-auto basis-auto bg-transparent border-none outline-none'
          />
        </div>
        <Select
          mode='tags'
          allowClear
          placeholder='Hashtag'
          className='w-1/2 mt-4'
          onChange={(v) => {
            setHashtag(v)
          }}
          value={hashtag}
          options={undefined}
        />
        <div className='flex flex-wrap gap-5 justify-between mt-2.5 max-w-full w-[510px]'>
          <div className='flex flex-wrap gap-4 items-start my-auto'>
            <Upload
              multiple
              beforeUpload={() => false} // Ngăn việc upload tự động
              fileList={fileList} // Kiểm soát danh sách file
              onChange={handleChange}
            >
              {' '}
              <button aria-label='Add image'>
                <img
                  loading='lazy'
                  src='/images/add-image.svg'
                  alt=''
                  className='object-contain shrink-0 w-6 aspect-square'
                />
              </button>
            </Upload>
            <button aria-label='Add GIF'>
              <img
                loading='lazy'
                src='/images/add-gif.svg'
                alt=''
                className='object-contain shrink-0 w-6 aspect-square'
              />
            </button>
            <button aria-label='Add poll'>
              <img
                loading='lazy'
                src='/images/add-poll.svg'
                alt=''
                className='object-contain shrink-0 w-6 aspect-square'
              />
            </button>
            <button aria-label='Add emoji'>
              <img
                loading='lazy'
                src='/images/add-emoji.svg'
                alt=''
                className='object-contain shrink-0 w-6 aspect-square'
              />
            </button>
            <button aria-label='Schedule tweet'>
              <img
                loading='lazy'
                src='/images/schedule-tweet.svg'
                alt=''
                className='object-contain shrink-0 w-6 aspect-square'
              />
            </button>
          </div>
          <button
            disabled={!tweetContent}
            onClick={handlePost}
            style={{ opacity: !tweetContent ? '0.5' : '1' }}
            className='overflow-hidden gap-2.5 self-stretch py-2.5 pr-4 pl-5 text-base font-bold leading-none text-center text-white whitespace-nowrap bg-sky-500 rounded-full min-h-[39px]'
          >
            Post
          </button>
        </div>
      </div>
    </div>
  )
}

export default TweetComposer
