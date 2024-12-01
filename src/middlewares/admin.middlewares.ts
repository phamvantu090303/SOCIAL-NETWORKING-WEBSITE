import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '../constants/Messager'

import { validate } from '../../utils/validation'
import databaseService from '../services/database.services'
import { hashPassword } from '../../utils/crypto'
import adminService from '../services/Admin.services'

export const AdminregisterValidator = validate(
  checkSchema({
    username: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 1,
          max: 100
        },
        errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
      },
      trim: true
    },

    email: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIREA
      },
      isEmail: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
      },
      trim: true,
      custom: {
        options: async (value) => {
          //hàm nhận giá trị value là giá trị của trường mail từ yêu cầu đầu vào.
          const result = await adminService.checkEmailAdminExist(value)
          if (result) {
            //nếu mà email tồn tại thì báo lổi
            throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXSTS)
          } //Giá trị trả về return result (trong trường hợp này là false) thường không được sử dụng trực tiếp trong các bước tiếp theo, mà chỉ để đảm bảo rằng hàm đã thực thi mà không có lỗi.
          return true //đến chổ này thì là ko có lổi nó sẽ qua bên controler để thực hiện đăng ký
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIREA
      },
      isString: {
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_FROM_6_TO_50
      }
    }
  })
)

export const AdminLoginValidator = validate(
  checkSchema({
    email: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIREA
      },
      isEmail: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const User = await databaseService.Admin.findOne({ email: value, password: hashPassword(req.body.password) })
          if (User === null) {
            throw new Error(USERS_MESSAGES.USERS_OR_PASSWORD_IS_INCORRECT)
          }
          req.admin = User
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIREA
      },
      isString: {
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_FROM_6_TO_50
      }
    }
  })
)
