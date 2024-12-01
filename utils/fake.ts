import { RegisterReqBody } from './../src/models/requests/Users.Requests'
import { TweetRequestBody } from './../src/models/requests/Tweer.requests'
import { TweetAudience, TweetType, UserVerifyStatus } from './../src/constants/enums'
import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import databaseService from '../src/services/database.services'
import User from '../src/models/schemas/User.schema'
import { hashPassword } from './crypto'
import Followers from '../src/models/schemas/Follower.schema'
import tweetsService from '../src/services/tweets.services'

// Mật khẩu cho các fake user
const PASSWORD = 'Tu123456@@'
// ID của tài khoản của mình, dùng để follow người khác
const MYID = new ObjectId('66e281119a857456cc98ffba')
// Số lượng user được tạo, mỗi user sẽ mặc định tweet 2 cái
const USER_COUNT = 10

const createRandomUser = (): RegisterReqBody => ({
  name: faker.internet.displayName(),
  email: faker.internet.email(),
  password: PASSWORD,
  confirm_password: PASSWORD,
  date_of_birth: faker.date.past().toISOString()
})

const createRandomTweet = (): TweetRequestBody => ({
  type: TweetType.Tweet,
  audience: TweetAudience.Everyone,
  content: faker.lorem.paragraph({
    min: 10,
    max: 160
  }),
  hashtags: [],
  medias: [],
  mentions: [],
  parent_id: null
})

const users: RegisterReqBody[] = faker.helpers.multiple(createRandomUser, {
  count: USER_COUNT
})

const insertMultipleUsers = async (users: RegisterReqBody[]): Promise<ObjectId[]> => {
  console.log('Đang tạo users ... ')
  const result = await Promise.all(
    users.map((user) => {
      const user_id = new ObjectId()
      return databaseService.users
        .insertOne(
          new User({
            ...user,
            username: `user${user_id.toString()}`,
            password: hashPassword(user.password),
            date_of_birth: new Date(user.date_of_birth),
            verify: UserVerifyStatus.Verified
          })
        )
        .then(() => user_id)
    })
  )
  console.log(`Đã tạo ${result.length} users`)
  return result
}

const followMultipleUsers = async (user_id: ObjectId, followed_user_ids: ObjectId[]): Promise<void> => {
  console.log('Đang thực hiện follow... ')
  await Promise.all(
    followed_user_ids.map((followed_user_id) =>
      databaseService.followers.insertOne(
        new Followers({
          user_id,
          followed_user_ids: followed_user_id
        })
      )
    )
  )
  console.log(`Followed ${followed_user_ids.length} users`)
}

const insertMultipleTweets = async (ids: ObjectId[]): Promise<void> => {
  console.log('Đang tạo tweets ... ')
  let count = 0
  await Promise.all(
    ids.map(async (id) => {
      await tweetsService.createTweet(id.toString(), createRandomTweet())
      await tweetsService.createTweet(id.toString(), createRandomTweet())
      count += 2
    })
  )
  console.log(`Đã tạo tổng cộng ${count} tweets`)
}

const main = async () => {
  const userIds = await insertMultipleUsers(users)
  await followMultipleUsers(new ObjectId(MYID), userIds)
  await insertMultipleTweets(userIds)
}

main()
