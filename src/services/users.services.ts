import { signToken } from './../../utils/jwt'
import { hashPassword } from './../../utils/crypto'
import { RegisterReqBody, UpdateMeReqBody } from '../models/requests/Users.Requests'
import User from '../models/schemas/User.schema'
import databaseService from './database.services'
import { TokenType, UserVerifyStatus } from '../constants/enums'
import RefreshToken from '../models/schemas/ResfestToken.Schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '../constants/Messager'
import Followers from '../models/schemas/Follower.schema'

class UsersService {
  //hàm tạo accessToken
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        verify
      },
      privatekey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN //thời gian hết hạn của accesstoken
      }
    })
  }
  //hàm tạo refreshToken
  private signRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify
      },
      privatekey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRSH_TOKEN_EXPIRES_IN
      }
    })
  }
  //hàm tạo tokenemail
  private signEmailVeryfiToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken,
        verify
      },
      privatekey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EAMIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }
  //hàm tạo token quên mk
  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ForgotPasswordToken,
        verify
      },
      privatekey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
      }
    })
  }

  private signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  async register(payload: RegisterReqBody) {
    //trong đó biến payload được định nghĩa với kiểu RegisterReqBody. Nếu kiểu RegisterReqBody đã được khai báo trước đó với các thuộc tính nhất định (như email và password đều là kiểu string), thì khi truyền dữ liệu vào payload, TypeScript sẽ kiểm tra xem các thuộc tính của đối tượng truyền vào có khớp với kiểu RegisterReqBody hay không.
    const user_id = new ObjectId() //tạo user_id
    const email_verify_token = await this.signEmailVeryfiToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    console.log('email_verify_token: ', email_verify_token)
    await databaseService.users.insertOne(
      new User({
        _id: user_id,
        email_verify_token,
        ...payload, //(...payload) để sao chép tất cả các thuộc tính từ payload vào đối tượng User.
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    //lấy user_id ra để đưa vào  payload: {
    //  user_id,
    // token_type: TokenType.RefreshToken
    // }, để tạo AccessToken
    // const user_id = result.insertedId.toString() //lấy giá trị id trong trường dử liệu
    const [access_token, refregh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    //access_token, refregh_token sẽ nhận giá trị từ  this.signAccessToken(user_id), this.signRefreshToken(user_id)
    // await databaseService.refeshToken.insertOne(
    //   new RefreshToken({
    //     user_id: new ObjectId(user_id),
    //     token: refregh_token
    //   })
    // )
    return {
      access_token,
      refregh_token
    }
  }
  //đăng nhập
  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refregh_token] = await this.signAccessAndRefreshToken({ user_id, verify })
    const objectId = new ObjectId(user_id) //chuyển user_id:string sang objectId

    // Kiểm tra xem user_id có tồn tại trong cơ sở dữ liệu không
    const existingToken = await databaseService.refeshToken.findOne({ user_id: objectId })

    if (existingToken) {
      // Nếu token đã tồn tại, xóa token cũ
      await databaseService.refeshToken.deleteOne({ user_id: objectId })
    }

    await databaseService.refeshToken.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refregh_token
      })
    )
    return {
      access_token,
      refregh_token
    }
  }
  //kiêmr tra email có tồn tại trong databaseService hay chưa nếu có thì trả về true ngược lại th false
  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    // console.log(user)
    return Boolean(user)
  }

  async logout(refresh_token: string) {
    await databaseService.refeshToken.deleteOne({ token: refresh_token })
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    }
  }

  async SeachUserById_in_colum_refreshToken(userId: string) {
    // Chuyển đổi userId từ chuỗi thành ObjectId
    const objectId = new ObjectId(userId)

    // kiểm tra xem có userId trong cột refreshtoken không nếu có thì trả về
    const user = await databaseService.refeshToken.findOne({ user_id: objectId })

    if (!user) {
      return null // Trả về null nếu không tìm thấy người dùng
    }

    return user // Trả về đối tượng người dùng nếu tìm thấy
  }

  async verifyEmail(user_id: string) {
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          email_verify_token: '',
          verify: UserVerifyStatus.Verified,
          updated_at: '$$NOW'
        }
      }
    ])
    return {
      message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS
    }
  }
  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVeryfiToken({ user_id, verify: UserVerifyStatus.Unverified })
    //giả bộ gửi email
    console.log('da gui email', email_verify_token)
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          email_verify_token,
          updated_at: '$$NOW'
        }
      }
    ])
    return {
      message: USERS_MESSAGES.RESEND_MESSAGE_EMAIL_SUCCESS
    }
  }

  async forgotPassword({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const forgot_password_token = await this.signForgotPasswordToken({
      user_id,
      verify
    })
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token,
          updated_at: '$$NOW'
        }
      }
    ])
    // gửi email kèm đừng lịn đến email người dùng: https://twitter.com/forgot-password?token=token
    console.log('forgot_password_token: ', forgot_password_token)
    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }

  async resetPassword(user_id: string, password: string) {
    databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token: '',
          password: hashPassword(password),
          updated_at: '$$NOW'
        }
      }
    ])
    return {
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
    }
  }

  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          //này gọi là fillter không muốn trả về các giá trị password ,email_verify_token: 0 thì sét về 0
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  // Service để lấy thông tin người dùng từ _id
  async getProfile(_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  // Service để lấy thông tin tất cả người dùng
  async getAllUsers() {
    return await databaseService.users
      .find()
      .project({
        password: 0,
        email_verify_token: 0,
        forgot_password_token: 0
      })
      .toArray()
  }

  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const user = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          ...(_payload as UpdateMeReqBody & { date_of_birth?: Date }),
          updated_at: new Date()
        }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async followe(user_id: string, followed_user_id: string) {
    const follower = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    if (follower === null) {
      await databaseService.followers.insertOne(
        new Followers({
          user_id: new ObjectId(user_id),
          followed_user_ids: new ObjectId(followed_user_id)
        })
      )
      return {
        message: USERS_MESSAGES.FOLLOW_SUCCESS
      }
    }
    return {
      message: USERS_MESSAGES.FOLLOW
    }
  }
  async unfollowe(user_id: string, followed_user_id: string) {
    const follower = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    // Không tim thấy document follower
    //nghĩa là chưa follow người này
    if (follower === null) {
      return {
        message: USERS_MESSAGES.ALREADY_UNFOLLOWED
      }
    }

    // Tìm thấy document follower
    // Nghía là đã follow người này rồi, thì ta tiến hành xóa document này
    await databaseService.followers.deleteOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })

    return {
      message: USERS_MESSAGES.UNFOLLOWED_SUCCESS
    }
  }
  async changePassword(user_id: string, new_password: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(new_password),
          updated_at: new Date()
        }
      }
    )
    return {
      message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS
    }
  }
  async getAllUserAdmin() {
    return await databaseService.users
      .find()
      .project({
        password: 0,
        email_verify_token: 0,
        forgot_password_token: 0
      })
      .toArray()
  }
  async getAllUser() {
    const data = await databaseService.users.find({}).toArray()
    return {
      data
    }
  }
  async getDetailUser(user_id: string) {
    if (!ObjectId.isValid(user_id)) {
      throw new Error('Invalid user ID')
    }
    const data = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    return {
      data
    }
  }

  async DeleteUser(user_id: string) {
    const data = await databaseService.users.findOneAndDelete({ _id: new ObjectId(user_id) })
    return {
      data
    }
  }
}
const usersService = new UsersService()
export default usersService
