import { Request } from 'express'
import { TokenPayload } from './../models/requests/User.requests'
import { User } from './../models/schemas/User.schema'
import Tweet from './models/schemas/Tweet.shema'

interface CustomRequest<T = any> extends Request {
  user?: User
  admin?: Admin
  decoded_authorization?: DecodedAuthorization
  decoded_refresh_token?: TokenPayload
  decoded_email_verify_tokens?: TokenPayload
  decoded_forgot_password_token?: TokenPayload
  tweet?: Tweet
  body: T
}

export default CustomRequest
