import { TokenPayload } from '../models/requests/Users.Requests'
import { Response } from 'express'
import Request from '../type'
import { LIKES_MESSAGES } from '../constants/Messager'
import { LikesTweetReqBody } from '../models/requests/Likes.requests'
import likesService from '../services/likes.services'

export const likesTweetController = async (req: Request<LikesTweetReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likesService.likesTweet(user_id, req.body.tweet_id)
  return res.json({
    message: LIKES_MESSAGES.LIKES_SUCCESSFULLY,
    result
  })
}

export const unlikesTweetController = async (req: Request<LikesTweetReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likesService.unlikesTweet(user_id, req.params.tweet_id)
  return res.json({
    message: LIKES_MESSAGES.UNLIKES_SUCCESSFULLY,
    result
  })
}
