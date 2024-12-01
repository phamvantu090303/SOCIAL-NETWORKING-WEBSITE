import { ObjectId } from 'mongodb'
interface NotificationType {
  _id?: ObjectId
  TweetId: ObjectId // ID bài viết hoặc nội dung
  ownerId: ObjectId // ID người nhận thông báo
  actorId: ObjectId // ID người thực hiện hành động
  actionType: 'comment' | 'like' | 'repost' | 'bookmark' // Loại hành động
  created_at?: Date
  isRead?: boolean
}
export default class Notification {
  _id: ObjectId
  title: string
  message: string
  TweetId: ObjectId
  ownerId: ObjectId
  actorId: ObjectId
  actionType: 'comment' | 'like' | 'repost' | 'bookmark'
  created_at: Date
  isRead: boolean

  constructor({ _id, TweetId, ownerId, actorId, actionType, created_at, isRead }: NotificationType) {
    this._id = _id || new ObjectId()
    this.TweetId = TweetId
    this.ownerId = ownerId
    this.actorId = actorId
    this.actionType = actionType
    this.created_at = created_at || new Date()
    this.isRead = isRead || false

    // Tự động tạo title và message
    switch (actionType) {
      case 'comment':
        this.title = 'Ai đó đã bình luận bài viết của bạn!'
        this.message = `Người dùng ${actorId} vừa bình luận vào bài viết của bạn.`
        break
      case 'like':
        this.title = 'Ai đó đã thích bài viết của bạn!'
        this.message = `Người dùng ${actorId} vừa thích bài viết của bạn.`
        break
      case 'repost':
        this.title = 'Bài viết của bạn đã được đăng lại!'
        this.message = `Người dùng ${actorId} vừa đăng lại bài viết của bạn.`
        break
      case 'bookmark':
        this.title = 'Bài viết của bạn đã được đánh dấu!'
        this.message = `Người dùng ${actorId} vừa đánh dấu bài viết của bạn.`
        break
      default:
        throw new Error('Loại hành động không hợp lệ')
    }
  }
}
