import { ObjectId } from 'mongodb'

interface reportType {
  _id?: ObjectId
  user_id: ObjectId
  tweet_id: ObjectId
  Contents_of_the_report: string
  created_at?: Date
}
export default class Reports {
  _id: ObjectId
  user_id: ObjectId
  tweet_id: ObjectId
  Contents_of_the_report: string
  created_at?: Date

  constructor({ _id, user_id, tweet_id, Contents_of_the_report, created_at }: reportType) {
    this._id = _id || new ObjectId()
    this.user_id = user_id
    this.tweet_id = tweet_id
    this.Contents_of_the_report = Contents_of_the_report
    this.created_at = created_at || new Date()
  }
}
