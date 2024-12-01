import { useState } from 'react'
import { axiosInstance } from '../../axios'
import { useNavigate } from 'react-router-dom'
import { message, Tag } from 'antd'
import Report from './Report'

function Tweet({
  id,
  user_id,
  author,
  handle,
  time,
  content,
  image,
  stats,
  setReload,
  reload,
  isDetail,
  hashtags,
  avatar,
  isChildTweet
}) {
  const [messageApi, contextHolder] = message.useMessage()
  const [isLiked, setIsLiked] = useState(false) // Trạng thái like
  const [isBookmarked, setIsBookmarked] = useState(false) // Trạng thái để kiểm tra nếu tweet đã được bookmark
  const navigate = useNavigate()
  const [report, setReport] = useState(false)
  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        // Nếu đã like, gọi API để unlike
        await axiosInstance.delete(`/likes/tweets/${id}`)
        setIsLiked(false)
        setReload((prev) => !prev) // Cập nhật lại dữ liệu
      } else {
        // Nếu chưa like, gọi API để like
        await axiosInstance.post('/likes', { tweet_id: id })
        await axiosInstance.post('/createNotification', { TweetId: id, ownerId: user_id, actionType: 'like' })

        setIsLiked(true)
        setReload((prev) => !prev) // Cập nhật lại dữ liệu
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleBookmarkToggle = async () => {
    try {
      if (isBookmarked) {
        // Nếu đã bookmark, gọi API để xóa bookmark
        await axiosInstance.delete(`/bookmarks/tweets/${id}`)
        setIsBookmarked(false)
        messageApi.info('Đã xóa tweet khỏi danh sách bookmark')
      } else {
        // Nếu chưa bookmark, gọi API để thêm bookmark
        await axiosInstance.post('/bookmarks', { tweet_id: id })
        setIsBookmarked(true)
        messageApi.success('Đã thêm tweet vào danh sách bookmark')
      }
      setReload((prev) => !prev) // Cập nhật lại dữ liệu
    } catch (error) {
      console.log(error)
    }
  }
  const handleReportClick = () => {
    setReport(true)
  }

  const closeReport = () => {
    setReport(false)
  }
  return (
    <article className='flex flex-col pl-px w-full max-w-[598px] max-md:max-w-full'>
      {contextHolder}
      <div className='flex flex-col w-full'>
        <div className='flex shrink-0 h-px bg-gray-200 max-md:max-w-full' />
      </div>
      <div className='flex flex-wrap gap-2.5 pr-px pl-4 mt-2.5 w-full max-w-[584px] max-md:max-w-full'>
        <div className='flex grow shrink items-start h-full w-[39px]'>
          <img
            loading='lazy'
            src={avatar ? avatar : '/images/user-avatar.jpg'}
            alt={author}
            className='object-contain aspect-square rounded-[99999px] w-[49px]'
          />
        </div>
        <div className='flex flex-col grow shrink self-start min-w-[240px] w-[499px] max-md:max-w-full'>
          <div className='flex flex-wrap gap-1 items-center pb-1 w-full text-base font-medium text-slate-500 max-md:max-w-full'>
            <div className='self-stretch my-auto font-bold text-neutral-900'>{author}</div>
            <div className='self-stretch my-auto'>{handle}</div>
            <div className='self-stretch my-auto'>{time}</div>
            {!isChildTweet && (
              <button className='ml-auto text-red-500 text-sm' onClick={handleReportClick}>
                Báo Cáo
              </button>
            )}
          </div>
          <p className='flex-1 shrink gap-2.5 w-full text-base font-medium text-neutral-900 max-md:max-w-full'>
            {content}
          </p>
          {report && <Report tweetID={id} onClose={closeReport} />}
          {isDetail && image ? (
            image.map((url, index) => (
              <div key={index}>
                {url?.includes('image') && (
                  <div className='flex overflow-hidden items-start py-2.5 w-full rounded-2xl max-md:max-w-full'>
                    <div className='flex overflow-hidden flex-col flex-1 shrink justify-center w-fit rounded-2xl  basis-0 min-w-[240px] max-md:max-w-full'>
                      <img
                        loading='lazy'
                        src={url}
                        alt=''
                        className='object-contain w-full aspect-[2.06] rounded-2xl max-md:max-w-full'
                      />
                    </div>
                  </div>
                )}
                {url?.includes('video') && (
                  <div className='flex overflow-hidden items-start py-2.5 w-full rounded-2xl max-md:max-w-full'>
                    <div className='flex overflow-hidden flex-col flex-1 shrink justify-center w-fit rounded-2xl  basis-0 min-w-[240px] max-md:max-w-full'>
                      <video src={url} controls></video>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>
              {image?.includes('image') && (
                <div className='flex overflow-hidden items-start py-2.5 w-full rounded-2xl max-md:max-w-full'>
                  <div className='flex overflow-hidden flex-col flex-1 shrink justify-center w-fit rounded-2xl  basis-0 min-w-[240px] max-md:max-w-full'>
                    <img
                      loading='lazy'
                      src={image}
                      alt=''
                      className='object-contain w-full aspect-[2.06] rounded-2xl max-md:max-w-full'
                    />
                  </div>
                </div>
              )}
              {image?.includes('video') && (
                <div className='flex overflow-hidden items-start py-2.5 w-full rounded-2xl max-md:max-w-full'>
                  <div className='flex overflow-hidden flex-col flex-1 shrink justify-center w-fit rounded-2xl  basis-0 min-w-[240px] max-md:max-w-full'>
                    <video src={image} controls></video>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className='flex gap-1 flex-wrap mt-4 mb-2'>
            {hashtags?.map((v, index) => (
              <Tag key={index} color='processing'>
                #{v.name}
              </Tag>
            ))}
          </div>
          {!isChildTweet && (
            <div className='flex overflow-hidden flex-wrap items-start py-1 w-full text-sm font-medium whitespace-nowrap text-slate-500 max-md:max-w-full'>
              <button aria-label={`${stats?.comments} comments`} className='flex grow shrink gap-2.5 w-[102px]'>
                <img
                  loading='lazy'
                  src='/images/comment-icon.svg'
                  alt=''
                  className='object-contain shrink-0 aspect-square w-[18px]'
                />
                <div>{stats?.comments}</div>
              </button>
              <button
                onClick={async () => {
                  try {
                    await axiosInstance.post('/tweets', {
                      medias: [],
                      type: 1,
                      audience: 0,
                      content: '',
                      hashtags: [],
                      mentions: [],
                      parent_id: id
                    })
                    setReload(!reload)
                  } catch (error) {
                    console.log(error)
                  }
                }}
                aria-label={`${stats?.retweets} retweets`}
                className='flex grow shrink gap-2.5 w-[102px]'
              >
                <img
                  loading='lazy'
                  src='/images/retweet-icon.svg'
                  alt=''
                  className='object-contain shrink-0 aspect-square w-[18px]'
                />
                <div>{stats?.retweets}</div>
              </button>
              {/* like/unlike */}
              <button
                onClick={handleLikeToggle}
                aria-label={`${stats?.likes} likes`}
                className='flex grow shrink gap-2.5 text-rose-500 w-[102px]'
              >
                <img
                  loading='lazy'
                  src={isLiked ? '/images/heartred.png' : '/images/like-while-icon.svg'} // Chọn icon dựa trên trạng thái
                  alt={isLiked ? 'Unlike' : 'Like'}
                  className='object-contain shrink-0 aspect-square w-[18px]'
                />
                <div>{isLiked ? stats?.likes : stats?.likes} like</div> {/* Cập nhật văn bản hiển thị */}
              </button>

              <button
                onClick={handleBookmarkToggle}
                aria-label={`${stats?.views} views`}
                className='flex grow shrink gap-2.5 w-[102px]'
              >
                <img
                  loading='lazy'
                  src={isBookmarked ? '/images/bookmarks-icon.svg' : '/images/bookmarks-icon.svg'} // Thay đổi icon dựa trên trạng thái
                  alt={isBookmarked ? 'Unbookmark' : 'Bookmark'}
                  className='object-contain shrink-0 aspect-square w-[18px]'
                />
                <div>{isBookmarked ? stats?.views : stats?.views}</div> {/* Cập nhật văn bản hiển thị */}
              </button>
            </div>
          )}
          {!isDetail && !isChildTweet && (
            <button
              onClick={() => {
                navigate(`/tweet/${id}`)
              }}
              className='self-start px-3 py-1.5 text-sm rounded-lg text-blue-500'
            >
              Xem chi tiết
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default Tweet
