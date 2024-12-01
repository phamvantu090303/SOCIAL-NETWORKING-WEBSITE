import {
  accessTokenValidatetor,
  isUserLoggedInValidator,
  verifiedUserValidator
} from '../middlewares/users.middlewares'
import { Router } from 'express'
import { wrapRequestHandler } from '../../utils/handlerl'
import {
  createTweetController,
  getAllTweetUser,
  getNewFeedsController,
  getReTweetController,
  getTweetChildrenController,
  getTweetController
} from '../controllers/tweets.controllers'
import {
  audienceValidator,
  createTweetValidator,
  getTweetChildrenValidator,
  paginationValidator,
  tweetIdValidator
} from '../middlewares/tweets.middlewares'

const tweetsRouter = Router()

/**
 * Description: Create Tweet
 * Path: /
 * Method: POST
 * Body: TweetRequestBody
 **/
tweetsRouter.post(
  '/',
  accessTokenValidatetor,
  verifiedUserValidator,
  createTweetValidator,
  wrapRequestHandler(createTweetController)
)
tweetsRouter.get(
  //lấy ra những tweet của người dùng hiệnn tại

  '/user/:user_id',

  paginationValidator,

  isUserLoggedInValidator(accessTokenValidatetor),

  isUserLoggedInValidator(verifiedUserValidator),

  wrapRequestHandler(getAllTweetUser)
)
/**
Description: Get Tweet detail
Path: /:tweet_id
Method: GET
Header: { Authorization ?: Bearer <access_token> }
*/

tweetsRouter.get(
  '/:tweet_id',
  tweetIdValidator,
  isUserLoggedInValidator(accessTokenValidatetor),
  isUserLoggedInValidator(verifiedUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetController)
)

/**
 * Description: Get Tweet Children
 * Path: /:tweet_id/children
 * Method: GET
 * Header: { Authorization ?: Bearer <access_token> }
 * Query: {limit: number, page: number, tweet_type: TweetType}
 */
tweetsRouter.get(
  '/:tweet_id/children',
  tweetIdValidator,
  paginationValidator,
  getTweetChildrenValidator,
  isUserLoggedInValidator(accessTokenValidatetor),
  isUserLoggedInValidator(verifiedUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetChildrenController)
)

/**

* Description: Get new feeds
* Path: /new-feeds

* Method: GET
* Header: { Authorization: Bearer <access_token> }
* Query: { limit: number, page: number }
*/
tweetsRouter.get(
  '/',
  paginationValidator,
  accessTokenValidatetor,
  verifiedUserValidator,
  wrapRequestHandler(getNewFeedsController)
)

tweetsRouter.get(
  '/:tweet_id/retweet',

  tweetIdValidator,

  paginationValidator,

  getTweetChildrenValidator,

  isUserLoggedInValidator(accessTokenValidatetor),

  isUserLoggedInValidator(verifiedUserValidator),

  audienceValidator,

  wrapRequestHandler(getReTweetController)
)

export default tweetsRouter
