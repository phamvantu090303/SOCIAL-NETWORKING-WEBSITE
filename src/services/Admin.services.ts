import { signToken } from './../../utils/jwt'
import { hashPassword } from './../../utils/crypto'
import { TokenType } from '../constants/enums'

import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { admintype } from '../models/requests/Admin.requests'
import Admin from '../models/schemas/Admin.schema'

class AdminService {
  //hàm tạo accessToken
  private signAccessToken({ user_id, role }: { user_id: string; role: string }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        role
      },
      privatekey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN //thời gian hết hạn của accesstoken
      }
    })
  }

  async CreateAdmin(payload: admintype) {
    //trong đó biến payload được định nghĩa với kiểu RegisterReqBody. Nếu kiểu RegisterReqBody đã được khai báo trước đó với các thuộc tính nhất định (như email và password đều là kiểu string), thì khi truyền dữ liệu vào payload, TypeScript sẽ kiểm tra xem các thuộc tính của đối tượng truyền vào có khớp với kiểu RegisterReqBody hay không.
    const user_id = new ObjectId()
    await databaseService.Admin.insertOne(
      new Admin({
        _id: user_id,
        ...payload,
        password: hashPassword(payload.password)
      })
    )

    const access_token = await this.signAccessToken({
      user_id: user_id.toString(),
      role: payload.role
    })
    return {
      access_token
    }
  }

  async login({ user_id, role }: { user_id: string; role: string }) {
    const access_token = await this.signAccessToken({ user_id, role })
    return {
      access_token
    }
  }
  //admin
  async checkEmailAdminExist(email: string) {
    const user = await databaseService.Admin.findOne({ email })
    // console.log(user)
    return Boolean(user)
  }
  async getallAdmin() {
    const data = await databaseService.Admin.find({}).toArray()
    return data
  }
}

const adminService = new AdminService()
export default adminService
