import { Router } from 'express'
import { wrapRequestHandler } from '../../utils/handlerl'
import {
  Allhashtag,
  Createhashtag,
  Deletehashtag,
  deleteTweet,
  DetailTweet,
  getAllDataTweet
} from '../controllers/admin/AdminTweet.controllers'
import { AllaccCount, DeleteUser, DetailAccCount } from '../controllers/admin/AdminListUser.controllers'
import { DeleteReport, DetailReport, getReport } from '../controllers/admin/AdminReport.controllers'
import { AdminLoginValidator, AdminregisterValidator } from '../middlewares/admin.middlewares'
import { AdminLogin, CreatAdmin, GetallAdmin } from '../controllers/admin/Admin.Controllers'

const AdminRoute = Router()
// trang admin quản lý  tweet
AdminRoute.get('/admin/tweets', wrapRequestHandler(getAllDataTweet))
AdminRoute.delete('/admin/delete/:tweet_id', wrapRequestHandler(deleteTweet))
AdminRoute.post('/admin/detail/:tweet_id', wrapRequestHandler(DetailTweet))

//trang admin quản lý Hashtag
AdminRoute.get('/admin/HashTag', wrapRequestHandler(Allhashtag))
AdminRoute.post('/admin/CreateHashTag', wrapRequestHandler(Createhashtag))
AdminRoute.delete('/admin/deleteHashTag/:_id', wrapRequestHandler(Deletehashtag))

//trang admin account
AdminRoute.get('/admin/AccCount', wrapRequestHandler(AllaccCount))
AdminRoute.post('/admin/AccCountDetail/:user_id', wrapRequestHandler(DetailAccCount))
AdminRoute.delete('/admin/deleteAccCount/:user_id', wrapRequestHandler(DeleteUser))

//trang admin
AdminRoute.get('/admin/Report', wrapRequestHandler(getReport))
AdminRoute.post('/admin/DetailReport/:_id', wrapRequestHandler(DetailReport))
AdminRoute.delete('/admin/deleteReport/:_id', wrapRequestHandler(DeleteReport))

//ds
AdminRoute.post('/admin', AdminregisterValidator, wrapRequestHandler(CreatAdmin))
AdminRoute.get('/admin/getALL', wrapRequestHandler(GetallAdmin))
AdminRoute.post('/admin/login', AdminLoginValidator, wrapRequestHandler(AdminLogin))

export default AdminRoute
