import { ParamsDictionary, Query } from 'express-serve-static-core'
import { TweetAudience, TweetType } from '../../constants/enums'
import { Media } from '../../models/Other'

export interface TweetRequestBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string // chỉ null khi tweet gốc, không thì là tweet_id cha dạng string
  hashtags: string[] // tên của hashtag dạng ['javascript', 'reactjs']
  mentions: string[] // user_id[]
  medias: Media[]
}

// gộp từ TweetPanam, TweetQueny, Pagination tạo thành TweetPanamQuenyPagination
export interface TweetPanamQuenyPagination extends ParamsDictionary, Pagination, Query, TweetPanam, TweetQueny {
  tweet_id: string
  limit: string
  page: string
  tweet_type: string
}

export interface TweetPanam extends ParamsDictionary {
  tweet_id: string
}

export interface TweetQueny extends Pagination, Query {
  tweet_type: string
}

export interface Pagination {
  limit: string
  page: string
}
