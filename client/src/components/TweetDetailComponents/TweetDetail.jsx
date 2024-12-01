// src/pages/TweetPage.js
import React, { useEffect, useState } from 'react'
import Tweet from '../layout/Tweet'
import Comment from './Comment'
import { Input, Button } from 'antd'
import { useParams } from 'react-router-dom'
import { axiosInstance } from '../../axios'
import moment from 'moment'
import ChildTweet from '../layout/ChildTweet'

const TweetDetail = () => {
  const [reload, setReload] = useState([])
  const [tweet, setTweet] = useState({})
  const [parentTweet, setParentTweet] = useState(null)
  const [comments, setComments] = useState([])
  const { id } = useParams()
  const [comment, setComment] = useState('')
  const [createNotifications, setCreateNotifications] = useState()
  console.log('setCreateNotifications', createNotifications)
  const handlePost = async () => {
    try {
      let medias = []
      await axiosInstance.post('/createNotification', {
        TweetId: id,
        ownerId: createNotifications.data.result.user_id,
        actionType: 'comment'
      })
      await axiosInstance.post('/tweets', {
        medias,
        type: 2,
        audience: 0,
        content: comment,
        hashtags: [], // tên của hashtag dạng ['javascript', 'reactjs']
        mentions: [], // user_id[]
        parent_id: id
      })
      setReload(!reload)
      setComment('')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    axiosInstance
      .get('/tweets/' + id)
      .then((res) => {
        setCreateNotifications(res)
        setTweet({
          ...res.data.result,
          id: res.data.result._id,
          author: res.data.result.user?.name,
          avatar: res.data.result.user?.avatar,
          handle: '@' + res.data.result.user?.username,
          time: moment(res.data.result.created_at).format('DD/MM/YYYY HH:mm'),
          content: res.data.result.content,
          image: res.data.result.medias.map((v) => v.url) || [],
          stats: {
            comments: res.data.result?.commet_count,
            retweets: res.data.result.retweet_count,
            likes: res.data.result.likes,
            views: res.data.result.quote_count
          }
        })
        if (res.data.result.type === 1) {
          axiosInstance.get(`/tweets/${res.data.result.parent_id}`).then((res2) => {
            setParentTweet({
              id: res2.data.result._id,
              author: res2.data.result.user?.name,
              avatar: res2.data.result.user?.avatar,
              handle: '@' + res2.data.result.user?.username,
              time: moment(res2.data.result.created_at).format('DD/MM/YYYY HH:mm'),
              content: res2.data.result.content,
              image: res2.data.result.medias.map((v) => v.url) || [],
              stats: {
                comments: res2.data.result?.commet_count,
                retweets: res2.data.result.retweet_count,
                likes: res2.data.result.likes,
                views: res2.data.result.quote_count
              }
            })
          })
        }
      })
      .catch((error) => {
        console.log(error)
        if (error?.response?.status === 401) {
          setUser(null)
        }
      })

    axiosInstance
      .get(`/tweets/${id}/children`, {
        params: {
          limit: 100,
          page: 1,
          tweet_type: 2
        }
      })
      .then((res) => {
        setComments(
          res.data.result.tweets.map((v) => ({
            id: v._id,
            ...v,
            content: v.content,
            time: moment(v.created_at).format('DD/MM/YYYY HH:mm')
          }))
        )
      })
      .catch((error) => {
        console.log(error)
        if (error?.response?.status === 401) {
          setUser(null)
        }
      })
  }, [reload])
  return (
    <div className='tweet-page  overflow-hidden bg-white rounded-lg shadow-lg'>
      {parentTweet ? (
        <ChildTweet {...tweet} setReload={setReload} reload={reload} isDetail={true} parent={parentTweet} />
      ) : (
        <Tweet {...tweet} setReload={setReload} reload={reload} isDetail={true} />
      )}
      <div className='comment-section mt-6'>
        <h3 className='font-bold text-xl mb-4'>Comments:</h3>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
      <div className='add-comment mt-6'>
        <Input.TextArea
          rows={3}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value)
          }}
          placeholder='Add a comment...'
          className='mb-2'
        />
        <Button disabled={!comment} onClick={handlePost} type='primary'>
          Post Comment
        </Button>
      </div>
    </div>
  )
}

export default TweetDetail
