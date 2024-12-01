import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Reports from '../models/schemas/report.schema'

class ReportServe {
  async ReportTweet(user_id: string, tweet_id: string, Contents_of_the_report: string) {
    const result = await databaseService.report.insertOne(
      new Reports({
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id),
        Contents_of_the_report
      })
    )
    return result
  }

  async getReportTweet() {
    const result = await databaseService.report.find({}).toArray()
    return result
  }
  async DetailReportTweet(_id: string) {
    const result = await databaseService.report
      .aggregate([
        {
          $match: {
            _id: new ObjectId(_id)
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
            localField: 'tweet_id',
            foreignField: '_id',
            as: 'tweet_id'
          }
        },
        {
          $unwind: {
            path: '$tweet_id'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'tweet_id.user_id',
            foreignField: '_id',
            as: 'userTweet'
          }
        },
        {
          $unwind: {
            path: '$userTweet'
          }
        }
      ])
      .toArray()
    return result
  }
  async DeleteReport(_id: string) {
    const data = await databaseService.report.findOneAndDelete({ _id: new ObjectId(_id) })
    return {
      data
    }
  }
}

const reportService = new ReportServe()
export default reportService
