import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '../src/constants/dir'
import path from 'path'
import nanoid from 'nanoid'
import CustomRequest from '../src/type'

// nếu trong server chưa có file " uploads " chỉ cần chạy lại server thì tạo lại 1 file mới
export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // mục đích là để tạo folder nested
      })
    }
  })
}

export const handleUploadImage = async (req: CustomRequest) => {
  //const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 300 * 1024, // 300KB
    maxTotalFileSize: 300 * 1024 * 4,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('Loại tệp không hợp lệ') as any)
      }
      return true
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      //eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('Tập tin rỗng'))
      }
      resolve(files.image as File[])
    })
  })
}

// Cách 1: Tạo unique id cho video ngay từ đầu
// Cách 2: Đợi video upload xong rồi tạo folder, move video vào

// Cách xử lý khi upload video và encode
// Có 2 giai đoạn
// Upload video: Upload video thành công thì resolve về cho người dùng
// Encode video: Khai bao thêm 1 url endpoint đe check xem cái video đó đã encode xong chưa

// export const handleUploadVideo = async (req: Request) => {
//   const formidable = (await import('formidable')).default
//   const { nanoid } = await import('nanoid')
//   const idName = nanoid()
//   const folderPath = path.resolve(UPLOAD_VIDEO_DIR)
//   fs.mkdirSync(folderPath)

//   const form = formidable({
//     uploadDir: folderPath,
//     // uploadDir: UPLOAD_VIDEO_DIR,
//     maxFiles: 1,
//     maxFileSize: 50 * 1024 * 1024, // 50MB
//     filter: function ({ name, originalFilename, mimetype }) {
//       const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
//       return valid
//     },
//     filename: function (name, ext, part) {
//       return idName + ext
//     }
//   })

//   return new Promise<File[]>((resolve, reject) => {
//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         return reject(err)
//       }
//       if (!files.video || files.video.length === 0) {
//         return reject(new Error('Tập tin rỗng'))
//       }
//       const videos = Array.isArray(files.video) ? files.video : [files.video]
//       videos.forEach((video) => {
//         const ext = getExtension(video.originalFilename as string)
//         fs.renameSync(video.filepath, video.filepath + '.' + ext)
//         video.newFilename += '.' + ext
//         video.filepath += '.' + ext
//       })
//       resolve(videos)
//     })
//   })
// }

export const handleUploadVideo = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const { nanoid } = await import('nanoid')
  const idName = nanoid()
  const folderPath = path.resolve(UPLOAD_VIDEO_DIR)

  // Kiểm tra nếu thư mục đã tồn tại trước khi tạo
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
  }

  const form = formidable({
    uploadDir: folderPath,
    maxFiles: 1,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      return valid
    },
    filename: function (name, ext, part) {
      return idName + ext
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!files.video || files.video.length === 0) {
        return reject(new Error('Tập tin rỗng'))
      }
      const videos = Array.isArray(files.video) ? files.video : [files.video]
      videos.forEach((video) => {
        const ext = getExtension(video.originalFilename as string)
        fs.renameSync(video.filepath, video.filepath + '.' + ext)
        video.newFilename += '.' + ext
        video.filepath += '.' + ext
      })
      resolve(videos)
    })
  })
}

export const getNameFromFullname = (fullname: string) => {
  const namearr = fullname.split('.')
  namearr.pop()
  return namearr.join('')
}

export const getExtension = (fullname: string) => {
  const namearr = fullname.split('.')
  return namearr[namearr.length - 1]
}
