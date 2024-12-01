import { changePasswordValidator, followValidator, unfollowValidator } from './../middlewares/users.middlewares'
import { wrapRequestHandler } from './../../utils/handlerl'
import { validate } from './../../utils/validation'
import {
  changePasswordController,
  followController,
  forgotPasswordController,
  getListUsersController,
  getMeController,
  getProfileController,
  getUsersForFollow,
  loginController,
  logoutController,
  registerController,
  resendverifyEmailController,
  resetPasswordController,
  unfollowController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordController
} from '../controllers/users.controllers'
import { Router } from 'express'
import {
  accessTokenValidatetor,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  LoginValidator,
  // refreshTokenValidator,
  registerValidator,
  resetPasswordTokenValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '../middlewares/users.middlewares'
import { UpdateMeReqBody } from '../models/requests/Users.Requests'
import { filterMiddleware } from '../middlewares/common.middlewares'

const UserRouter = Router()

//Khi một yêu cầu POST được gửi đến /login, dữ liệu từ các trường trong form email or password (vidu như form đăng nhập) sẽ có sẵn trong req.body
//và muốn  lấy được các dử liệu đó trong controler thì bạn hảy dùng  const { email, password } = req.body thì các trường sẽ đc use
UserRouter.post('/login', LoginValidator, wrapRequestHandler(loginController))

//UserRouter.post('/register', validate(registerValidator), registerController) khi chạy http này thì khi nhập các dử liệu lưu hết vào UserRouter.post('/register') của express và registerController muốn lấy dử liệu chỉ cần req.body
//khi qua registerController thì (req: Request, res: Response) để sử dụng các trường vừa nhập
UserRouter.post('/register', validate(registerValidator), wrapRequestHandler(registerController))

UserRouter.post('/logout', accessTokenValidatetor, wrapRequestHandler(logoutController))

UserRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

UserRouter.post('/resend-verify-email', accessTokenValidatetor, wrapRequestHandler(resendverifyEmailController))

UserRouter.post('/resend-forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

UserRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

UserRouter.post('/reset-password', resetPasswordTokenValidator, wrapRequestHandler(resetPasswordController))

UserRouter.get('/me', accessTokenValidatetor, wrapRequestHandler(getMeController))

// Định nghĩa route lấy profile qua _id
UserRouter.get('/profile/:_id', wrapRequestHandler(getProfileController))

// Đăng ký route cho việc lấy danh sách người dùng
UserRouter.get('/listUsers', getListUsersController)
// Đăng ký route cho việc lấy thông tin người dùng theo _id
UserRouter.get('/list/users/:_id', getProfileController)

UserRouter.patch(
  '/me',
  accessTokenValidatetor,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    //dùng để lọc ra những trường không được khai báo bên trong và chỉ lấy những trường khai báo
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)

UserRouter.get('/follow-list', accessTokenValidatetor, wrapRequestHandler(getUsersForFollow)) //lấy ds tất cả người dùng và đưa lên giao diện để hiện trên follow

UserRouter.post(
  '/follow',
  accessTokenValidatetor,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)

UserRouter.delete(
  '/follow/:user_id',
  accessTokenValidatetor,
  verifiedUserValidator,
  unfollowValidator,
  wrapRequestHandler(unfollowController)
)

UserRouter.put(
  '/change-password',
  accessTokenValidatetor,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default UserRouter
