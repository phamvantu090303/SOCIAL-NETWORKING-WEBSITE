import { NextFunction, Response } from 'express'
import mediasService from '../services/medias.services'
import { USERS_MESSAGES } from '../constants/Messager'
import path from 'path'
import fs from 'fs'
//import mime from 'mime'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '../constants/dir'
import HTTP_STATUS from '../constants/httpStatus'
import CustomRequest from '../type'
import { TokenPayload } from '../models/requests/Users.Requests'

export const uploadImageController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user_id = req.decoded_authorization?.user_id as string
  const url = await mediasService.uploadImageVip(req, user_id)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const imageController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await mediasService.getImage(user_id)
  return res.json({
    message: USERS_MESSAGES.GET_IMAGE_SUCCESS,
    result: result
  })
}

export const uploadVideoController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadVideo(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const videoStatusController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await mediasService.getVideoStatus(id as string)
  return res.json({
    message: USERS_MESSAGES.GET_VIDEO_STATUS_SUCCESS,
    result: result
  })
}

export const uploadVideoHLSController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadVideoHLS(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const serverImageController = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('không tìm thấy')
    }
  })
}

export const serverM3u8Controller = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { id } = req.params
  return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, id, 'master.m3u8'), (err) => {
    if (err) {
      res.status((err as any).status).send('không tìm thấy')
    }
  })
}

export const serverSegmentController = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { id, v, segment } = req.params
  //segment: 0.ts, 1.ts,...
  return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, id, v, segment), (err) => {
    if (err) {
      res.status((err as any).status).send('không tìm thấy')
    }
  })
}

export const serverVideoStreamController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const mime = await import('mime').then((module) => module.default);
  const range = req.headers.range
  if (!range) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Yêu cầu tiêu đề Range')
  }
  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)
  // 1MB = 10^6 bytes (Tính theo hệ 10, đây là thứ mà chúng ta hay thấy trên UI)
  // Còn nếu tính theo hệ nhị phân thì 1MB = 2^20 bytes (1024 * 1024)

  // Dung lượng video (bytes)
  const videoSize = fs.statSync(videoPath).size
  // DUng lượng video cho mỗi phân đoạn stream
  const chunkSize = 30 * 10 ** 6 // 1MB
  // Lấy giá trị byte bắt đầu từ header Range (vd: bytes=1048576-)
  const start = Number(range.replace(/\D/g, ''))
  // Lấy giá trị byte kết thúc, vượt quá dung lượng video thì lấy giá trị videoSize
  const end = Math.min(start + chunkSize, videoSize - 1)

  // Dung lượng thực tế cho mỗi đoạn video stream
  // THường đây sẽ là chunkSize, ngoại trừ đoạn cuối cùng
  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*'

  /**
* Format của header Content-Range: bytes <start><end>/<videoSize>
* Ví dụ: Content-Range: bytes 1048576-3145727/3145728
* Yêu cầu là `end' phải luôn luôn nhỏ hơn 'videoSize'
* không nên: 'Content-Range': 'bytes 0-100/100'
* nên 'Content-Range': 'bytes 0-99/100'

* Còn Content-Length sẽ là end - start + 1. Đại diện cho khoản cách.
* Để dễ hình dung, mọi người tưởng tượng từ số 0 đến số 10 thì ta có 11 số.
* byte cũng tương tự, nếu start = 0, end = 10 thi ta có 11 byte.
* Công thức là end - start + 1

* ChunkSize = 50
* videoSize = 100
*| 0--------50|51--------99|100(end)
* stream 1: start = 0, end = 50, contentLength = 51
* stream 2: start = 51, end = 99,contentLength = 49
**/

  const headers = {
    'Content-Range': `bytes ${start} - ${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoSteams = fs.createReadStream(videoPath, { start, end })
  videoSteams.pipe(res)
}
