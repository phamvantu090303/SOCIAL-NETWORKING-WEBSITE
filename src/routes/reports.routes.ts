import { Router } from 'express'
import { accessTokenValidatetor, verifiedUserValidator } from '../middlewares/users.middlewares'
import { wrapRequestHandler } from '../../utils/handlerl'
import { reportController } from '../controllers/reportControllers'
const reportRoute = Router()

reportRoute.post('/',accessTokenValidatetor,verifiedUserValidator,wrapRequestHandler(reportController))
export default reportRoute
