import { encodeHLSWithMultipleVideoStreams } from './../../utils/video'
import { Media } from './../models/Other'
import { EncodingStatus, MediaType } from './../constants/enums'
import { Request } from 'express'
import { getNameFromFullname, handleUploadImage, handleUploadVideo } from './../../utils/file'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '../constants/dir'
import path from 'path'
import fs from 'fs'
import fsPromise from 'fs/promises'
import { isProduction } from '../constants/config'
import { config } from 'dotenv'
import databaseService from './database.services'
import VideoStatus from './../models/schemas/VideoStatus.schema'
import ImageStatus from '../models/schemas/ImageStatus.schema'
import CustomRequest from '../type'
import { ObjectId } from 'mongodb'

config()

class Queue {
  items: string[]
  encoding: boolean

  constructor() {
    this.items = []
    this.encoding = false
  }

  async enqueue(item: string) {
    this.items.push(item)
    const idName = getNameFromFullname(item.split('/').pop() as string)
    await databaseService.videoStatus.insertOne(
      new VideoStatus({
        name: idName,
        status: EncodingStatus.Pending
      })
    )
    this.processEncode()
  }

  async processEncode() {
    if (this.encoding) return
    if (this.items.length > 0) {
      this.encoding = true
      const videoPath = this.items[0]
      const idName = getNameFromFullname(videoPath.split('/').pop() as string)
      await databaseService.videoStatus.updateOne(
        {
          name: idName
        },
        {
          $set: {
            status: EncodingStatus.Processing
          },
          $currentDate: {
            updated_at: true
          }
        }
      )

      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift()
        await fsPromise.unlink(videoPath)
        await databaseService.videoStatus.updateOne(
          {
            name: idName
          },
          {
            $set: {
              status: EncodingStatus.Success
            },
            $currentDate: {
              updated_at: true
            }
          }
        )
        console.log(`Mã hóa video ${videoPath} thành công`)
      } catch (error) {
        await databaseService.videoStatus
          .updateOne(
            {
              name: idName
            },
            {
              $set: {
                status: EncodingStatus.Failed
              },
              $currentDate: {
                updated_at: true
              }
            }
          )
          .catch((err) => {
            console.error('Cập nhật lỗi trạng thái video', err)
          })
        console.error(`Mã hóa video ${videoPath} lỗi:`, error)
        console.error(error)
      } finally {
        this.encoding = false
        this.processEncode() // Gọi lại để xử lý mục tiếp theo trong hàng đợi
      }
    } else {
      console.error('Hàng đợi mã hóa video đang trống')
    }
  }
}

const queue = new Queue()

class MediasService {
  // async uploadImage(req: Request) {
  //   const files = await handleUploadImage(req)
  //   const result: Media[] = await Promise.all(
  //     files.map(async (file) => {
  //       const newName = getNameFromFullname(file.newFilename)
  //       const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
  //       await sharp(file.filepath) // Tạo đối tượng sharp với filepath
  //         .jpeg() // Cấu hình thành định dạng JPEG
  //         .toFile(newPath) // Lưu kết quả thành file 'test.jpg'
  //       fs.unlinkSync(file.filepath) //xóa ảnh đã được Upload trên khổi file uploads/temp (bộ nhớ tạm)
  //       return {
  //         url: isProduction
  //           ? `${process.env.HOST}/static/image/${newName}.jpg`
  //           : `http://localhost:${process.env.PORT}/static/image/${newName}.jpg`,
  //         type: MediaType.Image
  //       }
  //     })
  //   )
  //   return result
  // }

  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = files.map((file) => {
      return {
        url: isProduction
          ? `${process.env.HOST}/static/video/${file.newFilename}`
          : `http://localhost:${process.env.PORT}/static/video/${file.newFilename}`,
        type: MediaType.Video
      }
    })
    return result
  }

  async uploadVideoHLS(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        queue.enqueue(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/video-hls/${newName}.m3u8`
            : `http://localhost:${process.env.PORT}/static/video-hls/${newName}.m3u8`,
          type: MediaType.HLS
        }
      })
    )
    return result
  }

  async getVideoStatus(id: string) {
    const data = await databaseService.videoStatus.findOne({ name: id })
    return data
  }

  async uploadImageVip(req: CustomRequest, user_id: string) {
    const _id = new ObjectId(user_id)
    const uploadSessionId = new ObjectId() // Tạo một _id duy nhất cho nhóm ảnh này
    const files = await handleUploadImage(req)

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)

        // Xử lý ảnh với sharp
        await sharp(file.filepath).jpeg().toFile(newPath)

        // Xóa ảnh tạm thời sau khi xử lý
        fs.unlinkSync(file.filepath)

        // Lưu trạng thái upload vào database
        await databaseService.imageStatus.insertOne(
          new ImageStatus({
            name: `http://localhost:3000/static/image/${newName}.jpg`,
            user_id: _id, // Cung cấp user_id
            upload_session_id: uploadSessionId, // Cung cấp _id cho nhóm ảnh
            status: EncodingStatus.Success // Bạn có thể điều chỉnh trạng thái nếu cần
          })
        )
        return {
          url: isProduction
            ? `${process.env.HOST}/static/image/${newName}.jpg`
            : `http://localhost:${process.env.PORT}/static/image/${newName}.jpg`,
          type: MediaType.Image
        }
      })
    )
    return result
  }

  async getImage(upload_session_id: string) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(upload_session_id) })
    return user
  }
}

const mediasService = new MediasService()

export default mediasService
