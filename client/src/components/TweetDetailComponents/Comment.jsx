// src/components/Comment.js
import React from 'react'
import { Card, Avatar, Button } from 'antd'
import { UserOutlined, HeartOutlined } from '@ant-design/icons'

const Comment = ({ comment }) => {
  const commentsData = []
  return (
    <div className='mb-4'>
      {/* Parent Comment */}
      <Card bordered={false} className='mb-2 shadow-sm rounded-md'>
        <div className='flex items-start'>
          <Avatar
            icon={comment?.user?.avatar ? <img src={comment?.user?.avatar} /> : <UserOutlined />}
            className='mr-4'
          />
          <div>
            <h4 className='font-semibold'>{comment.user.name}</h4>
            <p className='text-gray-700 mt-1'>{comment.content}</p>
            <div className='flex items-center text-gray-500 mt-2 space-x-4'>
              <span>{comment.time}</span>
              <Button type='link' className='p-0'>
                Thích
              </Button>
              <Button type='link' className='p-0'>
                Phản hồi
              </Button>
              <HeartOutlined style={{ color: 'red' }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Replies */}
      {comment.replies &&
        comment.replies.map((reply) => (
          <div key={reply.id} className='ml-12'>
            <Card bordered={false} className='mb-2 shadow-sm rounded-md bg-gray-50'>
              <div className='flex items-start'>
                <Avatar icon={<UserOutlined />} className='mr-4' />
                <div>
                  <h4 className='font-semibold'>{reply.username}</h4>
                  <p className='text-gray-700 mt-1'>{reply.content}</p>
                  <div className='flex items-center text-gray-500 mt-2 space-x-4'>
                    <span>{reply.time}</span>
                    <Button type='link' className='p-0'>
                      Thích
                    </Button>
                    <Button type='link' className='p-0'>
                      Phản hồi
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
    </div>
  )
}

export default Comment
