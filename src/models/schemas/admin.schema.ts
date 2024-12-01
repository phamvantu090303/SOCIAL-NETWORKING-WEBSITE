import { ObjectId } from 'mongodb'

interface AdminType {
  _id?: ObjectId
  username: string
  password: string
  email: string
  created_at?: Date
  role?: string
}

export default class Admin {
  _id: ObjectId
  username: string
  password: string
  email: string
  created_at: Date
  role: string

  constructor({ _id, username, password, email, created_at, role }: AdminType) {
    this._id = _id || new ObjectId()
    this.username = username
    this.password = password
    this.email = email
    this.created_at = created_at || new Date()
    this.role = role || 'admin'
  }
}
