import { ObjectId } from 'mongodb'
import databaseService from './database.services'

import { CreateNotifi } from '../models/requests/Notification.request'
import Notification from '../models/schemas/Notifications.schema'

class NotificationService {
  // Phương thức tạo thông báo

  async createNotification(actorId: ObjectId, payload: CreateNotifi) {
    const notification = new Notification({
      ...payload,
      TweetId: typeof payload.TweetId === 'string' ? new ObjectId(payload.TweetId) : payload.TweetId,
      ownerId: typeof payload.ownerId === 'string' ? new ObjectId(payload.ownerId) : payload.ownerId,
      actorId
    })

    // Lưu vào cơ sở dữ liệu
    await databaseService.Notifications.insertOne(notification)

    // Trả về thông báo đã tạo
    return notification
  }

  async getNotificationsByOwner(ownerId: ObjectId) {
    const notifications = await databaseService.Notifications.aggregate([
      {
        $match: {
          ownerId: ownerId
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'actorId',
          foreignField: '_id',
          as: 'actorId'
        }
      },
      {
        $unwind: {
          path: '$actorId'
        }
      },
      {
        $addFields: {
          message: {
            $concat: [' vừa ', '$actionType', ' bài viết của bạn.']
          }
        }
      },
      {
        $group: {
          _id: null,
          posts: {
            $push: {
              _id: '$_id',
              TweetId: '$TweetId',
              ownerId: '$ownerId',
              actorId: '$actorId',
              created_at: '$created_at',
              isRead: '$isRead',
              title: '$title',
              message: '$message'
            }
          },
          totalReadCount: {
            $sum: {
              $cond: [
                {
                  $eq: ['$isRead', true]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          posts: 1,
          totalReadCount: 1
        }
      }
    ]).toArray()

    return notifications
  }
}

// Khởi tạo singleton cho NotificationService
const notificationService = new NotificationService()
export default notificationService
