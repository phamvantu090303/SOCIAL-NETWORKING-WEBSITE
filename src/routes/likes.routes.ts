import { Router } from 'express'
import { accessTokenValidatetor, verifiedUserValidator } from '../middlewares/users.middlewares'
import { wrapRequestHandler } from '../../utils/handlerl'
import { likesTweetController, unlikesTweetController } from '../controllers/likes.controllers'
import { tweetIdValidator } from '../middlewares/tweets.middlewares'

const likesRouter = Router()

/**
Description: Likes Tweet
Path: /
Method: POST
Body: { tweet_id: string }
Header: { Authorization: Beager <access_token> }
*/

likesRouter.post(
  '',
  accessTokenValidatetor,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(likesTweetController)
)

/**
 * Description: Unlike Tweet
 * Path: /tweets/:tweet_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token>
 */
likesRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidatetor,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unlikesTweetController)
)

export default likesRouter
