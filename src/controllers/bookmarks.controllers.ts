import { TokenPayload } from '../models/requests/Users.Requests'
import { BookmankTweetReqBody } from '../models/requests/Bookmark.requests'
import { Response } from 'express'
import Request from '../type'

import { BOOKMARK_MESSAGES } from '../constants/Messager'
import bookmarkService from '../services/bookmarks.services'
import CustomRequest from '../type'

export const bookmarkTweetController = async (req: Request<BookmankTweetReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.bookmarkTweet(user_id, req.body.tweet_id)
  return res.json({
    message: BOOKMARK_MESSAGES.BOOKMARK_SUCCESSFULLY,
    result
  })
}

export const unbookmarkTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.unbookmarkTweet(user_id, req.params.tweet_id)
  return res.json({
    message: BOOKMARK_MESSAGES.UNBOOKMARK_SUCCESSFULLY,
    result
  })
}

export const getAllbookmarkTweetController = async (req: CustomRequest, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.getbookmarkTweet(user_id)
  console.log(result)
  return res.json({
    message: BOOKMARK_MESSAGES.GET_ALL_BOOKMARK_SUCCESSFULLY,
    result
  })
 
}
