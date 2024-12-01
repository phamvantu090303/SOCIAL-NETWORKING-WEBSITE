import { Router } from 'express'
import {
  imageController,
  uploadImageController,
  uploadVideoController,
  uploadVideoHLSController,
  videoStatusController
} from '../controllers/medias.controllers'
import { wrapRequestHandler } from '../../utils/handlerl'
import { accessTokenValidatetor, verifiedUserValidator } from '../middlewares/users.middlewares'
const mediasRouter = Router()

mediasRouter.post(
  '/upload-image',
  accessTokenValidatetor,
  verifiedUserValidator,
  wrapRequestHandler(uploadImageController)
)

mediasRouter.get('/image/:id', accessTokenValidatetor, wrapRequestHandler(imageController))

mediasRouter.post(
  '/upload-video',
  accessTokenValidatetor,
  verifiedUserValidator,
  wrapRequestHandler(uploadVideoController)
)

mediasRouter.post(
  '/upload-video-hls',
  accessTokenValidatetor,
  verifiedUserValidator,
  wrapRequestHandler(uploadVideoHLSController)
)

mediasRouter.get(
  '/video-status/:id',
  accessTokenValidatetor,
  verifiedUserValidator,
  wrapRequestHandler(videoStatusController)
)

export default mediasRouter
