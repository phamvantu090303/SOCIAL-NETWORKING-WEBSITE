import { Router } from 'express'
import { accessTokenValidatetor, verifiedUserValidator } from '../middlewares/users.middlewares'
import { wrapRequestHandler } from '../../utils/handlerl'
import { bookmarkTweetController, getAllbookmarkTweetController, unbookmarkTweetController } from '../controllers/bookmarks.controllers'
import { tweetIdValidator } from '../middlewares/tweets.middlewares'

const bookmarksRouter = Router()

/**
Description: Bookmark Tweet
Path: /
Method: POST
Body: { tweet_id: string }
Header: { Authorization: Beager <access_token> }
*/
bookmarksRouter.post(
  '',
  accessTokenValidatetor,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(bookmarkTweetController)
)

/**
Description: Unbookmark Tweet
Path: /tweets/:tweet_id
Method: DELETE
Body: { tweet_id: string }
Header: { Authorization: Beager <access_token> }
*/
bookmarksRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidatetor,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unbookmarkTweetController)
)
bookmarksRouter.get(
  '/getbookmark',
  accessTokenValidatetor,
  verifiedUserValidator,
  wrapRequestHandler(getAllbookmarkTweetController)
)
export default bookmarksRouter
