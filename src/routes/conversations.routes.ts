import { Router } from 'express'
import {
  accessTokenValidatetor,
  getConversationsValidator,
  verifiedUserValidator
} from '../middlewares/users.middlewares'
import { getConversationsController } from '../controllers/conversations.controllers'
import { paginationValidator } from '../middlewares/tweets.middlewares'
import { wrapRequestHandler } from '../../utils/handlerl'

const conversationsRouter = Router()

conversationsRouter.get(
  '/receivers/:receiver_id',
  accessTokenValidatetor,
  verifiedUserValidator,
  paginationValidator,
  getConversationsValidator,
  wrapRequestHandler(getConversationsController)
)

export default conversationsRouter
