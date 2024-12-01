import { ObjectId } from 'mongodb'

interface IRefreshToken {
  _id?: ObjectId
  user_id: ObjectId
  token: string
  created_at?: Date
}

export default class RefreshToken implements IRefreshToken {
  _id: ObjectId
  user_id: ObjectId
  token: string
  created_at: Date

  constructor({ _id = new ObjectId(), user_id, token, created_at = new Date() }: IRefreshToken) {
    this._id = _id
    this.user_id = user_id
    this.token = token
    this.created_at = created_at
  }
}
