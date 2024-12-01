import { ObjectId } from 'mongodb'

interface FollowenType {
  _id?: ObjectId
  user_id: ObjectId
  followed_user_ids: ObjectId
  created_at?: Date
}

export default class Followers {
  _id?: ObjectId
  user_id: ObjectId
  followed_user_ids: ObjectId
  created_at?: Date

  constructor({ _id, user_id, followed_user_ids, created_at }: FollowenType) {
    this._id = _id
    this.user_id = user_id
    this.followed_user_ids = followed_user_ids
    this.created_at = created_at || new Date()
  }
}
