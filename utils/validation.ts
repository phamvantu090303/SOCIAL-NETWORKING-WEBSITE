import { HTTP_STATUS } from './../src//constants/httpStatus'
import { ErrorWithStatus, EntityError } from './../src/models/Errors'
import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'

//validations:RunnableValidationChains<ValidationChain:quy định rằng tham số validations phải là một tập hợp các chuỗi xác thực  có thể chạy được.
export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validations.run(req) //Dòng này chạy tất cả các chuỗi xác thực trên đối tượng request
    const errors = validationResult(req)

    //nếu mà  không có lổi thì next tiếp tục request
    if (errors.isEmpty()) {
      return next()
    }

    const errorsObject = errors.mapped()
    const entityError = new EntityError({ message: 'Xác thực không thành công', errors: {} })

    // trả về lỗi không phải là lỗi do validate
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.errors[key] = errorsObject[key]
    }

    next(entityError)
  }
}
