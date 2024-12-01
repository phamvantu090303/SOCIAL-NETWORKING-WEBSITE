import { useEffect, useState } from 'react'
import ProfileHeader from './ProfileHeader'
import ProfileBanner from './ProfileBanner'
import ProfileInfo from './ProfileInfo'
import ProfileTabs from './ProfileTabs'
import { useAuth } from '../../store'
import moment from 'moment'
import { axiosInstance } from '../../axios'
import Tweet from '../layout/Tweet'
import { Button, Form, Input, message, Modal, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import ChildTweet from '../layout/ChildTweet'

const Profile = () => {
  const { user, setUser } = useAuth()
  const [tweets, setTweets] = useState([])
  const [reload, setReload] = useState(false)
  const [openResetPassModal, setOpenResetPassModal] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onFinish = (values) => {
    axiosInstance
      .put('/api/change-password', values)
      .then((res) => {
        setOpenResetPassModal(false)
        messageApi.success('Đổi mật khẩu thành công')
        form.resetFields()
      })
      .catch((error) => {
        messageApi.error('Đã có lỗi xảy ra')
      })
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  useEffect(() => {
    axiosInstance
      .get('/tweets/user/' + user._id, { params: { page: 1, limit: 100 } })
      .then((res) => {
        setTweets(
          res.data.result.tweets.map((v) => ({
            ...v,
            id: v._id,
            avatar: user?.avatar,
            author: user?.name,
            handle: '@' + user?.username,
            time: moment(v.created_at).format('DD/MM/YYYY HH:mm'),
            content: v.content,
            image: v.medias[0]?.url || null,
            stats: { comments: v.comment_count, retweets: v.retweet_count, likes: v.likes, views: v.bookmarks }
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
    <main className='flex overflow-hidden flex-col bg-white max-md:px-5'>
      {contextHolder}
      <Modal
        title='Reset password'
        footer={false}
        open={openResetPassModal}
        onCancel={() => {
          setOpenResetPassModal(false)
        }}
      >
        <Form
          name='basic'
          layout='vertical'
          form={form}
          style={{
            maxWidth: 600,
            padding: '20px'
          }}
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            label='Old Password'
            name='old_password'
            rules={[
              {
                required: true,
                message: 'Please input your Old Password!'
              }
            ]}
          >
            <Input.Password className='w-full' />
          </Form.Item>

          <Form.Item
            label='Password'
            name='password'
            className='mt-10'
            rules={[
              {
                required: true,
                message: 'Please input your password!'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label='Confirm Password'
            name='confirm_password'
            className='mt-10'
            rules={[
              {
                required: true,
                message: 'Please input your Confirm Password!'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <div className='flex justify-end'>
              {' '}
              <Button type='primary' htmlType='submit'>
                Reset{' '}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <div className='flex overflow-hidden flex-col self-center px-px max-w-full w-[600px]'>
        <ProfileHeader
          name={user?.name}
          tweetCount={9}
          avatarSrc={
            user?.avatar ||
            'https://cdn.builder.io/api/v1/image/assets/TEMP/a56c91bef59ca6dafb970ac1cbc23aa339cd866e233985e0941734ae4fb1c5d7?placeholderIfAbsent=true&apiKey=ee3b4c55f4e940649da4e87de99f1704'
          }
        />
        <div className='flex flex-col pb-4 w-full max-md:max-w-full'>
          <ProfileBanner
            src={
              user.cover_photo ||
              'https://avitek.vn/wp-content/uploads/2020/08/Hero-Banner-Placeholder-Light-1024x480.png'
            }
          />
          <Space>
            <button className='overflow-hidden self-end py-2.5 pr-4 pl-5 mt-2.5 text-base font-bold leading-none text-center text-sky-500 rounded-full border border-sky-500 border-solid min-h-[39px] max-md:mr-2.5'>
              Edit profile
            </button>
            <button
              onClick={() => {
                setOpenResetPassModal(true)
              }}
              className='overflow-hidden self-end py-2.5 pr-4 pl-5 mt-2.5 text-base font-bold leading-none text-center text-sky-500 rounded-full border border-sky-500 border-solid min-h-[39px] max-md:mr-2.5'
            >
              Edit password
            </button>
            <button
              onClick={() => {
                axiosInstance
                  .post('/api/logout', {
                    refresh_token: localStorage.getItem('refregh_token')
                  })
                  .then((res) => {
                    console.log(res)

                    setUser(null)
                    localStorage.removeItem('access_token')
                    navigate('/login')
                  })
                  .catch((error) => {
                    messageApi.error('đã có lỗi xảy ra')
                  })
              }}
              className='overflow-hidden self-end py-2.5 pr-4 pl-5 mt-2.5 text-base font-bold leading-none text-center text-sky-500 rounded-full border border-sky-500 border-solid min-h-[39px] max-md:mr-2.5'
            >
              Logout{' '}
            </button>
          </Space>
          <ProfileInfo
            name={user?.name}
            username={user?.username}
            bio={user?.bio}
            location={user?.location}
            joinDate={moment(user?.created_at).format('DD/MM/YYYY')}
            following={569}
            followers={72}
          />
        </div>
        <ProfileTabs />
        <div className='flex flex-col pl-px w-full max-w-[598px] max-md:max-w-full'>
          {tweets.map((tweet, index) => {
            let parent
            console.log(tweet?.tweet_children[0])
            if (tweet?.tweet_children[0]) {
              parent = { ...tweet?.tweet_children[0], user: tweet?.user[0] }
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
                  views: parent.bookmarks
                }
              }
            }

            return tweet?.tweet_children.length > 0 ? (
              <ChildTweet key={index} setReload={setReload} reload={reload} parent={parent} {...tweet} />
            ) : (
              <Tweet key={index} setReload={setReload} reload={reload} {...tweet} />
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default Profile
