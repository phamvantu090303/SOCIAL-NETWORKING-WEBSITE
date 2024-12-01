import Tweet from '../models/schemas/Tweet.shema'
import { TweetRequestBody } from '../models/requests/Tweer.requests'
import databaseService from './database.services'
import { ObjectId, WithId } from 'mongodb'
import Hashtag from '../models/schemas/Hashtag.schema'
import { TweetType } from '../constants/enums'

class TweetsService {
  async checkAndCreateHashtag(hashtags: string[]) {
    const hashtagDocuments = await Promise.all(
      hashtags.map((hashtag) => {
        // Tìm hashtag trong database, nếu có thì lấy, không thì tạo mới
        return databaseService.hashtags.findOneAndUpdate(
          { name: hashtag },
          {
            $setOnInsert: new Hashtag({ name: hashtag })
          },
          {
            upsert: true,
            returnDocument: 'after'
          }
        )
      })
    )
    return hashtagDocuments.map((hashtag) => (hashtag as WithId<Hashtag>)._id)
  }

  async createTweet(user_id: string, body: TweetRequestBody) {
    // Nếu bạn đã có hashtags từ body

    const hashtags = await this.checkAndCreateHashtag(body.hashtags)

    console.log(hashtags)

    // Tạo tweet mới trong database

    const result = await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,

        content: body.content,

        hashtags, // Sử dụng biến hashtags đã được chuyển đổi

        mentions: body.mentions,

        medias: body.medias,

        parent_id: body.parent_id,

        type: body.type,

        user_id: new ObjectId(user_id)
      })
    )

    // Nếu type là 1, thực hiện truy vấn với MongoDB Aggregation

    if (body.type === 1 || body.type === 3) {
      const aggregationResult = await databaseService.tweets

        .aggregate([
          {
            $match: {
              _id: new ObjectId(result.insertedId)
            }
          },

          {
            $lookup: {
              from: 'users',

              localField: 'user_id',

              foreignField: '_id',

              as: 'user'
            }
          },

          {
            $unwind: {
              path: '$user'
            }
          },

          {
            $lookup: {
              from: 'tweets',

              localField: 'parent_id',

              foreignField: '_id',

              as: 'tweet'
            }
          },

          {
            $unwind: {
              path: '$tweet'
            }
          }
        ])

        .toArray()

      return aggregationResult
    }

    // Nếu type khác 1, trả về tweet như bình thường

    const tweet = await databaseService.tweets.findOne({ _id: result.insertedId })

    return tweet
  }

  async getReTweet({
    user_id,

    tweet_id,

    tweet_type,

    limit,

    page
  }: {
    user_id?: string

    tweet_id: string

    tweet_type: TweetType

    limit: number

    page: number
  }) {
    const tweets = await databaseService.tweets

      .aggregate<Tweet>([
        {
          $match: {
            parent_id: new ObjectId(tweet_id),

            type: tweet_type
          }
        },

        {
          $lookup: {
            from: 'hashtags',

            localField: 'hashtags',

            foreignField: '_id',

            as: 'hashtags'
          }
        },

        {
          $lookup: {
            from: 'tweets',

            localField: 'parent_id',

            foreignField: '_id',

            as: 'Tweet_goc'
          }
        },

        {
          $unwind: {
            path: '$Tweet_goc'
          }
        },

        {
          $lookup: {
            from: 'users',

            localField: 'mentions',

            foreignField: '_id',

            as: 'mentions'
          }
        },

        {
          $lookup: {
            from: 'users',

            localField: 'user_id',

            foreignField: '_id',

            as: 'user'
          }
        },

        {
          $unwind: {
            path: '$user'
          }
        },

        {
          $addFields: {
            mentions: {
              $map: {
                input: '$mentions',

                as: 'mention',

                in: {
                  _id: '$$mention._id',

                  name: '$$mention.name',

                  username: '$$mention.username',

                  email: '$$mention.email'
                }
              }
            }
          }
        },

        {
          $lookup: {
            from: 'bookmarks',

            localField: '_id',

            foreignField: 'tweet_id',

            as: 'bookmarks'
          }
        },

        {
          $lookup: {
            from: 'likes',

            localField: '_id',

            foreignField: 'tweet_id',

            as: 'likes'
          }
        },

        {
          $lookup: {
            from: 'tweets',

            localField: '_id',

            foreignField: 'parent_id',

            as: 'tweet_children'
          }
        },

        {
          $addFields: {
            bookmarks: {
              $size: '$bookmarks'
            },

            likes: {
              $size: '$likes'
            },

            retweet_count: {
              $size: {
                $filter: {
                  input: '$tweet_children',

                  as: 'item',

                  cond: {
                    $eq: ['$$item.type', TweetType.Retweet]
                  }
                }
              }
            },

            comment_count: {
              $size: {
                $filter: {
                  input: '$tweet_children',

                  as: 'item',

                  cond: {
                    $eq: ['$$item.type', TweetType.Comment]
                  }
                }
              }
            },

            quote_count: {
              $size: {
                $filter: {
                  input: '$tweet_children',

                  as: 'item',

                  cond: {
                    $eq: ['$$item.type', TweetType.QuoteTweet]
                  }
                }
              }
            }
          }
        },

        {
          $project: {
            tweet_children: 0
          }
        },

        {
          $skip: limit * (page - 1)
        },

        {
          $limit: limit
        }
      ])

      .toArray()

    const ids = tweets.map((tweet) => tweet._id as ObjectId) //chuyển thành một mảng id

    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }

    const date = new Date()

    const [, total] = await Promise.all([
      databaseService.tweets.updateMany(
        {
          _id: {
            $in: ids
          }
        },

        {
          $inc: inc,

          $set: { updated_at: date }
        }
      ),

      databaseService.tweets.countDocuments({
        parent_id: new ObjectId(tweet_id),

        type: tweet_type
      })
    ])

    tweets.forEach((tweet) => {
      tweet.updated_at = date

      if (user_id) {
        tweet.user_views += 1
      } else {
        tweet.guest_views += 1
      }
    })

    return { tweets, total }
  }

  async increaseView(tweet_id: string, user_id?: string) {
    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }

    const result = await databaseService.tweets.findOneAndUpdate(
      { _id: new ObjectId(tweet_id) },
      {
        $inc: inc,
        $currentDate: { updated_at: true }
      },
      {
        returnDocument: 'after',
        projection: {
          guest_views: 1,
          user_views: 1,
          updated_at: 1
        }
      }
    )
    return result as WithId<{
      guest_views: number
      user_views: number
      updated_at: Date
    }>
  }

  async getTweetChildren({
    //comment

    user_id,

    tweet_id,

    tweet_type,

    limit,

    page
  }: {
    user_id?: string

    tweet_id: string

    tweet_type: TweetType

    limit: number

    page: number
  }) {
    const tweets = await databaseService.tweets

      .aggregate<Tweet>([
        {
          $match: {
            parent_id: new ObjectId(tweet_id),

            type: tweet_type
          }
        },

        {
          $lookup: {
            from: 'hashtags',

            localField: 'hashtags',

            foreignField: '_id',

            as: 'hashtags'
          }
        },

        {
          $lookup: {
            from: 'users',

            localField: 'mentions',

            foreignField: '_id',

            as: 'mentions'
          }
        },

        {
          $lookup: {
            from: 'users',

            localField: 'user_id',

            foreignField: '_id',

            as: 'user'
          }
        },

        {
          $unwind: {
            path: '$user'
          }
        },

        {
          $addFields: {
            mentions: {
              $map: {
                input: '$mentions',

                as: 'mention',

                in: {
                  _id: '$$mention._id',

                  name: '$$mention.name',

                  username: '$$mention.username',

                  email: '$$mention.email'
                }
              }
            }
          }
        },

        {
          $lookup: {
            from: 'bookmarks',

            localField: '_id',

            foreignField: 'tweet_id',

            as: 'bookmarks'
          }
        },

        {
          $lookup: {
            from: 'likes',

            localField: '_id',

            foreignField: 'tweet_id',

            as: 'likes'
          }
        },

        {
          $lookup: {
            from: 'tweets',

            localField: '_id',

            foreignField: 'parent_id',

            as: 'tweet_children'
          }
        },

        {
          $addFields: {
            bookmarks: {
              $size: '$bookmarks'
            },

            likes: {
              $size: '$likes'
            },

            retweet_count: {
              $size: {
                $filter: {
                  input: '$tweet_children',

                  as: 'item',

                  cond: {
                    $eq: ['$$item.type', TweetType.Retweet]
                  }
                }
              }
            },

            comment_count: {
              $size: {
                $filter: {
                  input: '$tweet_children',

                  as: 'item',

                  cond: {
                    $eq: ['$$item.type', TweetType.Comment]
                  }
                }
              }
            },

            quote_count: {
              $size: {
                $filter: {
                  input: '$tweet_children',

                  as: 'item',

                  cond: {
                    $eq: ['$$item.type', TweetType.QuoteTweet]
                  }
                }
              }
            }
          }
        },

        {
          $project: {
            tweet_children: 0
          }
        },

        {
          $skip: limit * (page - 1)
        },

        {
          $limit: limit
        }
      ])

      .toArray()

    const ids = tweets.map((tweet) => tweet._id as ObjectId) //chuyển thành một mảng id

    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }

    const date = new Date()

    const [, total] = await Promise.all([
      databaseService.tweets.updateMany(
        {
          _id: {
            $in: ids
          }
        },

        {
          $inc: inc,

          $set: { updated_at: date }
        }
      ),

      databaseService.tweets.countDocuments({
        parent_id: new ObjectId(tweet_id),

        type: tweet_type
      })
    ])

    tweets.forEach((tweet) => {
      tweet.updated_at = date

      if (user_id) {
        tweet.user_views += 1
      } else {
        tweet.guest_views += 1
      }
    })

    return { tweets, total }
  }

  async getNewFeeds({ user_id, limit, page }: { user_id: string; limit: number; page: number }) {
    const user_id_obj = new ObjectId(user_id)

    const followed_user_ids = await databaseService.followers

      .find(
        {
          user_id: user_id_obj
        },

        {
          projection: {
            followed_user_ids: 1,

            _id: 0
          }
        }
      )

      .toArray()

    const ids = followed_user_ids.flatMap((item) => item.followed_user_ids)

    ids.push(user_id_obj)

    const [tweets, total] = await Promise.all([
      databaseService.tweets

        .aggregate([
          {
            $match: {
              user_id: { $in: ids },

              type: { $in: [0, 1] }
            }
          },

          {
            $lookup: {
              from: 'users',

              localField: 'user_id',

              foreignField: '_id',

              as: 'user'
            }
          },

          {
            $unwind: '$user'
          },

          {
            $match: {
              $or: [
                { audience: 0 },

                {
                  $and: [{ audience: 1 }, { 'user.twitter_circle': { $in: [user_id_obj] } }]
                }
              ]
            }
          },

          {
            $skip: limit * (page - 1)
          },

          {
            $limit: limit
          },

          {
            $lookup: {
              from: 'hashtags',

              localField: 'hashtags',

              foreignField: '_id',

              as: 'hashtags'
            }
          },

          {
            $lookup: {
              from: 'users',

              localField: 'mentions',

              foreignField: '_id',

              as: 'mentions'
            }
          },

          {
            $addFields: {
              mentions: {
                $map: {
                  input: '$mentions',

                  as: 'mention',

                  in: {
                    _id: '$$mention._id',

                    name: '$$mention.name',

                    username: '$$mention.username',

                    email: '$$mention.email'
                  }
                }
              }
            }
          },

          {
            $lookup: {
              from: 'bookmarks',

              localField: '_id',

              foreignField: 'tweet_id',

              as: 'bookmarks'
            }
          },

          {
            $lookup: {
              from: 'likes',

              localField: '_id',

              foreignField: 'tweet_id',

              as: 'likes'
            }
          },

          {
            $lookup: {
              from: 'tweets',

              localField: 'parent_id',

              foreignField: '_id',

              as: 'tweet_children'
            }
          },
          {
            $lookup: {
              from: 'tweets',

              localField: '_id',

              foreignField: 'parent_id',

              as: 'tweet'
            }
          },
          {
            $lookup: {
              from: 'users',

              localField: 'tweet_children.user_id',

              foreignField: '_id',

              as: 'user_cha'
            }
          },

          {
            $addFields: {
              bookmarks: { $size: '$bookmarks' },

              likes: { $size: '$likes' },

              retweet_count: {
                $size: {
                  $filter: {
                    input: '$tweet',

                    as: 'item',

                    cond: { $eq: ['$$item.type', TweetType.Retweet] }
                  }
                }
              },

              comment_count: {
                $size: {
                  $filter: {
                    input: '$tweet',

                    as: 'item',

                    cond: { $eq: ['$$item.type', TweetType.Comment] }
                  }
                }
              },

              quote_count: {
                $size: {
                  $filter: {
                    input: '$tweet',

                    as: 'item',

                    cond: { $eq: ['$$item.type', TweetType.QuoteTweet] }
                  }
                }
              }
            }
          },

          {
            $project: {
              user: {
                password: 0,

                email_verify_token: 0,

                forgot_password_token: 0,

                twitter_circle: 0,

                date_of_birth: 0
              }
            }
          }
        ])

        .toArray(),

      databaseService.tweets

        .aggregate([
          {
            $match: {
              user_id: { $in: ids }
            }
          },

          {
            $lookup: {
              from: 'users',

              localField: 'user_id',

              foreignField: '_id',

              as: 'user'
            }
          },

          {
            $unwind: '$user'
          },

          {
            $match: {
              $or: [
                { audience: 0 },

                {
                  $and: [{ audience: 1 }, { 'user.twitter_circle': { $in: [user_id_obj] } }]
                }
              ]
            }
          },

          {
            $count: 'total'
          }
        ])

        .toArray()
    ])

    const tweet_ids = tweets.map((tweet) => tweet._id as ObjectId)

    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }

    const date = new Date()

    await databaseService.tweets.updateMany(
      {
        _id: {
          $in: tweet_ids
        }
      },

      {
        $inc: inc,

        $set: { updated_at: date }
      }
    ),
      tweets.forEach((tweet) => {
        tweet.updated_at = date

        tweet.user_views += 1
      })

    return { tweets, total: total[0]?.total || 0 }
  }

  async getAllTweetUser({
    user_id,

    tweet_type,

    limit,

    page
  }: {
    user_id: string

    tweet_type: TweetType

    limit: number

    page: number
  }) {
    const tweets = await databaseService.tweets

      .aggregate<Tweet>([
        {
          $match: {
            user_id: new ObjectId(user_id),

            type: { $in: [0, 1] }
          }
        },

        {
          $lookup: {
            from: 'hashtags',

            localField: 'hashtags',

            foreignField: '_id',

            as: 'hashtags'
          }
        },

        {
          $lookup: {
            from: 'users',

            localField: 'mentions',

            foreignField: '_id',

            as: 'mentions'
          }
        },

        {
          $addFields: {
            mentions: {
              $map: {
                input: '$mentions',

                as: 'mention',

                in: {
                  _id: '$$mention._id',

                  name: '$$mention.name',

                  username: '$$mention.username',

                  email: '$$mention.email'
                }
              }
            }
          }
        },

        {
          $lookup: {
            from: 'bookmarks',

            localField: '_id',

            foreignField: 'tweet_id',

            as: 'bookmarks'
          }
        },

        {
          $lookup: {
            from: 'likes',

            localField: '_id',

            foreignField: 'tweet_id',

            as: 'likes'
          }
        },

        {
          $lookup: {
            from: 'users',

            localField: 'user_id',

            foreignField: '_id',

            as: 'user_id'
          }
        },

        {
          $unwind: {
            path: '$user_id'
          }
        },

        {
          $lookup: {
            from: 'tweets',

            localField: 'parent_id',

            foreignField: '_id',

            as: 'tweet_children'
          }
        },
        {
          $lookup: {
            from: 'tweets',

            localField: '_id',

            foreignField: 'parent_id',

            as: 'tweet'
          }
        },
        {
          $lookup: {
            from: 'users',

            localField: 'tweet_children.user_id',

            foreignField: '_id',

            as: 'user'
          }
        },

        {
          $addFields: {
            bookmarks: {
              $size: '$bookmarks'
            },

            likes: {
              $size: '$likes'
            },

            retweet_count: {
              $size: {
                $filter: {
                  input: '$tweet',

                  as: 'item',

                  cond: {
                    $eq: ['$$item.type', TweetType.Retweet]
                  }
                }
              }
            },

            comment_count: {
              $size: {
                $filter: {
                  input: '$tweet',

                  as: 'item',

                  cond: {
                    $eq: ['$$item.type', TweetType.Comment]
                  }
                }
              }
            },

            quote_count: {
              $size: {
                $filter: {
                  input: '$tweet',

                  as: 'item',

                  cond: {
                    $eq: ['$$item.type', TweetType.QuoteTweet]
                  }
                }
              }
            }
          }
        },

        {
          $skip: limit * (page - 1)
        },

        {
          $limit: limit
        }
      ])

      .toArray()

    const ids = tweets.map((tweet) => tweet._id as ObjectId) //chuyển thành một mảng id

    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }

    const date = new Date()

    const [, total] = await Promise.all([
      databaseService.tweets.updateMany(
        {
          _id: {
            $in: ids
          }
        },

        {
          $inc: inc,

          $set: { updated_at: date }
        }
      ),

      databaseService.tweets.countDocuments({
        user_id: new ObjectId(user_id),

        type: tweet_type
      })
    ])

    tweets.forEach((tweet) => {
      tweet.updated_at = date

      if (user_id) {
        tweet.user_views += 1
      } else {
        tweet.guest_views += 1
      }
    })

    return { tweets, total }
  }
  //admin Tweet
  async dataAllTweet() {
    try {
      const result = await databaseService.tweets.find({ type: 0 }).toArray()
      return { success: true, data: result }
    } catch (error) {
      console.error('Error fetching tweets:', error)
      return { success: false, message: 'Failed to retrieve tweets', error }
    }
  }
  async deleteTweet(tweet_id: string) {
    const result = await databaseService.tweets.findOneAndDelete({ _id: new ObjectId(tweet_id) })
    return {
      result
    }
  }
  async AdminDetail(tweet_id: string) {
    const result = await databaseService.tweets.findOne({ _id: new ObjectId(tweet_id) })
    return {
      result
    }
  }

  //admin HashTag
  async dataHashTag() {
    const result = await databaseService.hashtags.find({}).toArray()
    return {
      result
    }
  }
  async CreateHashTag(names: string[]) {
    try {
      const hashtagIds = await this.checkAndCreateHashtag(names)
      return { success: 'Create HashTag Thành Công', hashtagIds } // Trả về danh sách ID của hashtag đã được tạo
    } catch (error) {
      console.error('Error creating hashtag:', error)
      return { success: false, message: 'Failed to create hashtag', error }
    }
  }

  async DeleteHashTag({ _id }: { _id: ObjectId }) {
    try {
      // Sử dụng ObjectId để tìm và xóa hashtag trong cơ sở dữ liệu
      const result = await databaseService.hashtags.deleteOne({ _id })
      return { success: 'Delete HashTag Thành Công', result }
    } catch (error) {
      console.error('Error deleting hashtag:', error)
      throw new Error('Failed to delete hashtag')
    }
  }
}
const tweetsService = new TweetsService()
export default tweetsService
