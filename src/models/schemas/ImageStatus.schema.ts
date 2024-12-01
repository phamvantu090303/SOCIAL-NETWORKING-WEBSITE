import { EncodingStatus } from '../../constants/enums'
import { ObjectId } from 'mongodb'

interface ImageStatusType {
  _id?: ObjectId
  upload_session_id?: ObjectId
  user_id: ObjectId
  name: string
  status: EncodingStatus
  message?: string
  created_at?: Date
  updated_at?: Date
}

export default class ImageStatus {
  _id?: ObjectId
  upload_session_id?: ObjectId
  user_id: ObjectId
  name: string
  status: EncodingStatus
  message: string
  created_at: Date
  updated_at: Date

  constructor({ _id, upload_session_id, user_id, name, status, message, created_at, updated_at }: ImageStatusType) {
    const date = new Date()
    this._id = _id
    this.upload_session_id = upload_session_id
    this.user_id = user_id
    this.name = name
    this.status = status
    this.message = message || ''
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
