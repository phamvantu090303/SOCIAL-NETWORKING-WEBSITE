import { checkSchema } from 'express-validator'
import { validate } from '../../utils/validation'
import { MediaTypeQuery, PeopleFollow } from '../constants/enums'

export const searchValidator = validate(
  checkSchema(
    {
      content: {
        isString: {
          errorMessage: 'Content phải là chuỗi'
        }
      },
      media_type: {
        optional: true,
        isIn: {
          options: [Object.values(MediaTypeQuery)]
        },
        errorMessage: `Media loại phải là một trong ${Object.values(MediaTypeQuery).join(', ')}`
      },
      people_follow: {
        optional: true,
        isIn: {
          options: [Object.values(PeopleFollow)],
          errorMessage: 'Số người theo dõi phải là 0 hoặc 1'
        }
      }
    },
    ['query']
  )
)
