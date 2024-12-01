import { TokenPayload } from './../models/requests/Users.Requests'
import { NextFunction, Response } from 'express'
import CustomRequest from '../type'

import reportService from '../services/report.services'
import { reportType } from '../models/requests/report.requests'

export const reportController = async (req: CustomRequest<reportType>, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const tweet_id = req.body.tweet_id
  const Contents_of_the_report = req.body.contents_of_the_report
  console.log(req.body)
  const result = await reportService.ReportTweet(user_id, tweet_id, Contents_of_the_report)
  res.json({
    message: 'Báo cáo Thành Công',
    result
  })
}
