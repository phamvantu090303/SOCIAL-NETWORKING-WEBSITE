import { Response } from 'express'
import conversationService from '../services/conversations.service'
import CustomRequest from '../type'
import { GetConversationsParams } from '../models/requests/Conversation.requests'

export const getConversationsController = async (req: CustomRequest<GetConversationsParams>, res: Response) => {
  const { receiver_id } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const sender_id = req.decoded_authorization?.user_id as string

  const result = await conversationService.getConversations({
    sender_id,
    receiver_id,
    limit,
    page
  })

  res.json({
    message: 'Get Thực hiện cuộc trò chuyện thành công',
    result: {
      limit,
      page,
      total_page: Math.ceil(result.total / limit),
      conversations: result.conversations
    }
  })
}
