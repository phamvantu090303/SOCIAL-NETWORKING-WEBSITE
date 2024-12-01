import { useEffect, useState } from 'react'
import Tweet from '../layout/Tweet'
import { axiosInstance } from '../../axios'
import { useAuth } from '../../store'
import moment from 'moment'
import { useSearchParams } from 'react-router-dom'
import ChildTweet from '../layout/ChildTweet'

function Search() {
  const [tweets, setTweets] = useState([])
  const [reload, setReload] = useState(false)
  const { setUser } = useAuth()
  const [query] = useSearchParams()
  const content = query.get('q')
  useEffect(() => {
    axiosInstance
      .get('/search', { params: { page: 1, limit: 100, content } })
      .then((res) => {
        setTweets(
          res.data.result.tweets.map((v) => {
            return {
              ...v,
              id: v._id,
              author: v.user.name,
              handle: '@' + v.user.username,
              avatar: v.user.avatar,
              time: moment(v.created_at).format('DD/MM/YYYY HH:mm'),
              content: v.content,
              image: v.medias[0]?.url || null,
              stats: {
                comments: v.comment_count,
                retweets: v.retweet_count,
                likes: v.likes,
                views: v.bookmarks
              }
            }
          })
        )
      })
      .catch((error) => {
        console.log(error)
        if (error.response.status === 401) {
          setUser(null)
        }
      })
  }, [reload, content])
  return (
    <main className='flex overflow-hidden flex-col px-px mt-0 max-w-full w-[600px] max-md:mt-0'>
      <header className='flex overflow-hidden flex-col pt-4 w-full text-xl font-bold whitespace-nowrap max-w-[598px] text-neutral-900 max-md:max-w-full'>
        <div className='flex flex-wrap gap-5 justify-between mr-3.5 ml-4 max-md:mr-2.5 max-md:max-w-full'>
          <h1>Search</h1>
        </div>
        <div className='flex shrink-0 mt-3.5 h-px bg-gray-200 max-md:max-w-full' />
      </header>
      <div className='flex overflow-hidden flex-col justify-center pb-2.5 w-full bg-slate-50 max-md:max-w-full'>
        <div className='flex shrink-0 h-px bg-gray-200 max-md:max-w-full' />
      </div>
      {tweets.map((tweet, index) => {
        let parent
        if (tweet?.tweet_con?.at(0)) {
          parent = { ...tweet?.tweet_con[0], user: tweet?.user_con[0] }
          parent = {
            ...parent,
            id: parent._id,
            author: parent.user.name,
            handle: '@' + parent.user.username,
            avatar: parent.user.avatar,
            time: moment(parent.created_at).format('DD/MM/YYYY HH:mm'),
            content: parent.content,
            image: parent.medias[0]?.url || null,
            stats: {
              comments: parent.comment_count,
              retweets: parent.retweet_count,
              likes: parent.likes,
              views: parent.quote_count
            }
          }
        }

        return tweet?.tweet_con?.length > 0 ? (
          <ChildTweet key={index} setReload={setReload} reload={reload} parent={parent} {...tweet} />
        ) : (
          <Tweet key={index} setReload={setReload} reload={reload} {...tweet} />
        )
      })}
    </main>
  )
}

export default Search
