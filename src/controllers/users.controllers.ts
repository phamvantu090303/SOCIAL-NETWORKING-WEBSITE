import { NextFunction, Request, Response } from 'express'
import usersService from '../services/users.services'
import {
  ChangePasswondReqBody,
  followReqBody,
  forgotPasswordReqBody,
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  UnfollowReqParams,
  UpdateMeReqBody,
  VerifyForgotPasswordReqBody
} from '../models/requests/Users.Requests'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '../constants/Messager'
import CustomRequest from '../type'
import HTTP_STATUS from '../constants/httpStatus'
import databaseService from '../services/database.services'
import { UserVerifyStatus } from '../constants/enums'
import User from '../models/schemas/User.schema'

//CustomRequest<LoginReqBody> là mở rộng của Request có thể dùng nó hoặc req: Request<ParamsDictionary, any, LoginReqBody>
export const loginController = async (req: CustomRequest<LoginReqBody>, res: Response) => {
  const { user }: any = req //{ user } Trực tiếp lấy đối tượng user từ req.user mà bạn vừa gán bên user.middleware
  const user_id = user._id as ObjectId
  const { access_token, refregh_token } = await usersService.login({ user_id: user_id.toString(), verify: user.verify })
  // Lưu access token vào cookie tại đây
  res.cookie('access_token', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN || '3600') * 1000
  })
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    access_token,
    refregh_token
  })
}

export const registerController = async (
  // khi người dùng gửi một yêu cầu HTTP đến endpoint đăng ký, dữ liệu mà họ nhập vào và gửi sẽ đc lưu req.body
  req: CustomRequest<RegisterReqBody>, //req.body sẽ được kiểm tra dựa trên cấu trúc của interface(RegisterReqBody) này.nếu đúng thì lm tiếp mà nếu sai với cấu trúc interface (RegisterReqBody) đc khai báo thì sẽ next báo lổi
  res: Response,
  next: NextFunction
) => {
  // throw new Error('test err')
  // const { email, password, data_of_birth, confirm_password, name } = req.body //body có kiểu RegisterReqBody được khai baó thành interface để lấy ra các trường dử liệu

  //bên users.services dùng asyn thì khi gọi sang bên này thì phải dùng await
  const result = await usersService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (req: CustomRequest<LogoutReqBody>, res: Response) => {
  const { decoded_authorization } = req // Lấy thông tin giải mã từ access token từ  req.decoded_authorization = decoded_authorization

  // Chuyển đổi user_id thành ObjectId nếu cần
  const user_id = decoded_authorization.user_id
  // console.log(user_id)
  // Kiểm tra xem access token có thuộc về người dùng hiện tại không
  const user = await usersService.SeachUserById_in_colum_refreshToken(user_id)

  // console.log(user)

  if (!user) {
    return res.status(403).json({ message: USERS_MESSAGES.INVALID_TOKEN })
  }
  const result = await usersService.logout(user.token)
  return res.json(result)
}

export const verifyEmailController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_email_verify_tokens
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })
  // Nếu không tìm thấy user thì mình sẽ báo lỗi
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USERS_NOT_FOUND
    })
  }

  // Đã verify rồi thì mình sẽ không báo lỗi
  // Mà mình sẽ trả về status OK với message là đã verify trước đó rồi
  if (user.email_verify_token === '') {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await usersService.verifyEmail(user_id)
  return res.json({
    result
  })
}
//khi người dùng muốn gửi lại email xác thực thì chạy link này
export const resendverifyEmailController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { decoded_authorization } = req
  const user_id = decoded_authorization.user_id
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  // console.log(user)
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USERS_NOT_FOUND
    })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  //nếu đã chạy qua các bước trên thì chưa xác thực email thì chạy hàm dưới để gửi email xác thực
  const result = await usersService.resendVerifyEmail(user_id)
  return res.json(result)
}

export const forgotPasswordController = async (
  req: CustomRequest<forgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id, verify } = req.user as User
  const result = await usersService.forgotPassword({ user_id: (_id as ObjectId).toString(), verify })
  return res.json(result)
}

export const verifyForgotPasswordController = async (
  req: CustomRequest<VerifyForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  return res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}

export const resetPasswordController = async (
  req: CustomRequest<ResetPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  const result = await usersService.resetPassword(user_id, password)
  return res.json({ result })
}

export const getMeController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await usersService.getMe(user_id)
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    result: user
  })
}

// Controller để lấy thông tin Profile
export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.params

    // Kiểm tra xem _id có phải ObjectId hợp lệ hay không
    if (!ObjectId.isValid(_id)) {
      return res.status(400).json({ message: 'Định dạng ID người dùng không hợp lệ.' })
    }

    const user = await usersService.getProfile(_id)

    // Nếu user không tồn tại
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' })
    }

    // Trả về thông tin người dùng
    return res.json({
      message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
      result: user
    })
  } catch (error) {
    next(error) // Xử lý lỗi
  }
}

// Controller để lấy thông tin tất cả Users
export const getListUsersController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const users = await usersService.getAllUsers()
    return res.status(200).json({
      message: 'Lấy danh sách người dùng thành công.',
      result: users
    })
  } catch (error) {
    next(error) // Xử lý lỗi
  }
}

export const updateMeController = async (req: CustomRequest<UpdateMeReqBody>, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { body } = req
  const user = await usersService.updateMe(user_id, body)
  // console.log(user)
  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    result: user
  })
}

export const getUsersForFollow = async (req: CustomRequest, res: Response) => {
  try {
    const { user_id } = req.decoded_authorization as TokenPayload // Lấy ID của người dùng hiện tại từ token
    const _id = new ObjectId(user_id)
    const users = await databaseService.users.find({ _id: { $ne: _id } }).toArray() // Tìm tất cả người dùng trừ người dùng hiện tại
    res.json(users) // Trả về danh sách người dùng để view lên màn hình
  } catch (err) {
    res.status(500).json({ message: 'Có lỗi xảy ra!' })
  }
}

export const followController = async (req: CustomRequest<followReqBody>, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { followed_user_id } = req.body
  const user = await usersService.followe(user_id, followed_user_id)
  // console.log(user)
  return res.json({
    result: user
  })
}
export const unfollowController = async (req: CustomRequest<UnfollowReqParams>, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const followed_user_id = req.params.user_id
  const result = await usersService.unfollowe(user_id, followed_user_id)
  return res.json(result)
}

export const changePasswordController = async (
  req: CustomRequest<ChangePasswondReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { password } = req.body
  const result = await usersService.changePassword(user_id, password)
  return res.json(result)
}
