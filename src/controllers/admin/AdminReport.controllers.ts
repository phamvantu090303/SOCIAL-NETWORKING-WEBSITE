import { Request, Response } from 'express'
import reportService from '../../services/report.services'

export const getReport = async (req: Request, res: Response) => {
  try {
    const result = await reportService.getReportTweet()
    return res.status(200).json({ result })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'lổi serve', error })
  }
}

export const DetailReport = async (req: Request, res: Response) => {
  try {
    const id = req.params._id
    const result = await reportService.DetailReportTweet(id)
    return res.status(200).json({ result })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'lổi serve', error })
  }
}

export const DeleteReport = async (req: Request, res: Response) => {
  const _id = req.params._id
  const data = await reportService.DeleteReport(_id)
  return res.status(200).json({
    message: 'Delete Thành Công',
    data
  })
}
