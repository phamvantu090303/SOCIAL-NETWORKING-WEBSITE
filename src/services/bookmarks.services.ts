import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Bookmark from '../models/schemas/Bookmark.schema'

class BookmarkService {
  async bookmarkTweet(user_id: string, tweet_id: string) {
    await databaseService.bookmarks.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Bookmark({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )

    // Aggregation pipeline to fetch related user and tweet info
    const bookmarks = await databaseService.bookmarks
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'users_bookmark'
          }
        },
        {
          $unwind: {
            path: '$users_bookmark'
          }
        },
        {
          $project: {
            users_bookmark: {
              password: 0,
              email_verify_token: 0,
              forgot_password_token: 0,
              bio: 0,
              location: 0,
              website: 0,
              cover_photo: 0
            }
          }
        },
        {
          $lookup: {
            from: 'tweets',
            localField: 'tweet_id',
            foreignField: '_id',
            as: 'users_tweet'
          }
        },
        {
          $unwind: {
            path: '$users_tweet'
          }
        },
        {
          $project: {
            users_tweet: {
              password: 0,
              email_verify_token: 0,
              forgot_password_token: 0,
              bio: 0,
              location: 0,
              website: 0,
              cover_photo: 0
            }
          }
        }
      ])
      .toArray()
    return bookmarks
  }

  async unbookmarkTweet(user_id: string, tweet_id: string) {
    await databaseService.bookmarks.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })

    // Aggregation pipeline to fetch related user and tweet info (if needed)
    const bookmarks = await databaseService.bookmarks
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'users_bookmark'
          }
        },
        {
          $unwind: {
            path: '$users_bookmark'
          }
        },
        {
          $project: {
            users_bookmark: {
              password: 0,
              email_verify_token: 0,
              forgot_password_token: 0,
              bio: 0,
              location: 0,
              website: 0,
              cover_photo: 0
            }
          }
        },
        {
          $lookup: {
            from: 'tweets',
            localField: 'tweet_id',
            foreignField: '_id',
            as: 'users_tweet'
          }
        },
        {
          $unwind: {
            path: '$users_tweet'
          }
        },
        {
          $project: {
            users_tweet: {
              password: 0,
              email_verify_token: 0,
              forgot_password_token: 0,
              bio: 0,
              location: 0,
              website: 0,
              cover_photo: 0
            }
          }
        }
      ])
      .toArray()

    return bookmarks
  }
  async getbookmarkTweet(user_id: string) {
    const bookmarks = await databaseService.bookmarks

      .aggregate([
        {
          $match: {
            user_id: new ObjectId(user_id)
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
          $lookup: {
            from: 'tweets',

            localField: 'tweet_id',

            foreignField: '_id',

            as: 'tweet_id'
          }
        },

        {
          $lookup: {
            from: 'users',

            localField: 'tweet_id.user_id',

            foreignField: '_id',

            as: 'user_tweet_id'
          }
        },

        {
          $lookup: {
            from: 'tweets',

            localField: 'tweet_id.parent_id',

            foreignField: '_id',

            as: 'tweet_con'
          }
        },

        {
          $lookup: {
            from: 'users',

            localField: 'tweet_con.user_id',

            foreignField: '_id',

            as: 'user_con'
          }
        },

        {
          $project: {
            'user_con.email_verify_token': 0,

            'user_con.forgot_password_token': 0,

            'user_con.twitter_circle': 0,

            'user_con.bio': 0,

            'user_con.password': 0,

            'user_con.location': 0,

            'user_con.website': 0,

            'user_con.cover_photo': 0,

            'user_tweet_id.email_verify_token': 0,

            'user_tweet_id.forgot_password_token': 0,

            'user_tweet_id.twitter_circle': 0,

            'user_tweet_id.bio': 0,

            'user_tweet_id.password': 0,

            'user_tweet_id.location': 0,

            'user_tweet_id.website': 0,

            'user_tweet_id.cover_photo': 0
          }
        }
      ])

      .toArray()

    return bookmarks
  }
}

const bookmarkService = new BookmarkService()
export default bookmarkService
