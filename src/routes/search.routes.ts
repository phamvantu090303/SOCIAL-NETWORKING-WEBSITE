import { Router } from 'express'
import { searchController } from '../controllers/search.controllers'
import { accessTokenValidatetor, verifiedUserValidator } from '../middlewares/users.middlewares'
import { searchValidator } from '../middlewares/search.middlewares'
import { wrapRequestHandler } from '../../utils/handlerl'

const searchRouter = Router()

searchRouter.get(
  '/',
  accessTokenValidatetor,
  verifiedUserValidator,
  searchValidator,
  wrapRequestHandler(searchController)
)

export default searchRouter
