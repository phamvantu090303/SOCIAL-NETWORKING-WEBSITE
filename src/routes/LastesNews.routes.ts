import { Router } from 'express'

import { wrapRequestHandler } from '../../utils/handlerl'
import { lasterNew } from '../controllers/LastesNews.controllers'

const RouterLatestNew = Router()

RouterLatestNew.get('/new', wrapRequestHandler(lasterNew))

export default RouterLatestNew
