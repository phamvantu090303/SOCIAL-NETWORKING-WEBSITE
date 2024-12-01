import { ObjectId } from 'mongodb'
import CustomRequest from '../type'
import { TokenPayload } from '../models/requests/Users.Requests'
import { CreateNotifi } from '../models/requests/Notification.request'
import notificationService from '../services/Notifications.services'
import { Response } from 'express'

export const createNotification = async (req: CustomRequest<CreateNotifi>, res: Response) => {
  try {
    const actorId = req.decoded_authorization as TokenPayload
    const user_id = new ObjectId(actorId.user_id)
    const result = await notificationService.createNotification(user_id, req.body)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false })
  }
}

export const getNotificationsByOwner = async (req: CustomRequest, res: Response) => {
  try {
    const ownerId = req.decoded_authorization as TokenPayload
    const user_id = new ObjectId(ownerId.user_id)
    const notifications = await notificationService.getNotificationsByOwner(user_id)

    res.status(200).json({
      success: true,
      data: notifications
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ' loi '
    })
  }
}
