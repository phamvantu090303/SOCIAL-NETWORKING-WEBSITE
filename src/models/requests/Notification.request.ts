import { ObjectId } from 'mongodb'

export interface CreateNotifi {
  TweetId: ObjectId // ID bài viết hoặc nội dung được tương tác
  ownerId: ObjectId // ID người nhận thông báo
  actionType: 'comment' | 'like' | 'repost' | 'bookmark' // Loại hành động
}
