import { Request, Response } from 'express'
import tweetsService from '../../services/tweets.services'
import { ObjectId } from 'mongodb'

//lấy tất cả các tweet ra cho admin
export const getAllDataTweet = async (req: Request, res: Response) => {
  const data = await tweetsService.dataAllTweet()
  console.log(data)
  return res.status(200).json({ success: 'Lấy danh sách tweet thành công', data })
}
//admin delete
export const deleteTweet = async (req: Request, res: Response) => {
  const tweet_id = req.params.tweet_id
  const result = await tweetsService.deleteTweet(tweet_id)
  return res.status(200).json({ success: 'Xóa tweet thành công', result })
}
//chi tiết tweet
export const DetailTweet = async (req: Request, res: Response) => {
  const tweet_id = req.params.tweet_id
  const result = await tweetsService.AdminDetail(tweet_id)
  return res.status(200).json({ success: 'Detail tweet thành công', result })
}
//admin quản lý hashtag
export const Allhashtag = async (req: Request, res: Response) => {
  const result = await tweetsService.dataHashTag()
  return res.status(200).json({ result })
}

export const Createhashtag = async (req: Request, res: Response) => {
  const names: string[] = req.body.name
  console.log(names)
  const result = await tweetsService.CreateHashTag(names)
  return res.status(200).json({ result })
}

export const Deletehashtag = async (req: Request, res: Response) => {
  try {
    const result = await tweetsService.DeleteHashTag({ _id: new ObjectId(req.params._id) })
    return res.status(200).json({ result })
  } catch (error) {
    console.error('Error deleting hashtag:', error)
    return res.status(500).json({ success: false, message: 'Failed to delete hashtag', error })
  }
}
