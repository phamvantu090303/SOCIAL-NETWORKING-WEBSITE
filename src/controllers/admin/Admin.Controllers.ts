import { Response, Request } from 'express'
import { adminLoginReqBody, admintype } from '../../models/requests/Admin.requests'
import CustomRequest from '../../type'
import adminService from '../../services/Admin.services'
import { ObjectId } from 'mongodb'

export const CreatAdmin = async (req: CustomRequest<admintype>, res: Response) => {
  const result = await adminService.CreateAdmin(req.body)
  return res.status(200).json({ result })
}

export const AdminLogin = async (req: CustomRequest<adminLoginReqBody>, res: Response) => {
  if (!req.admin) {
    return res.status(400).json({ message: 'Admin not found' })
  }
  const { admin }: any = req
  const user_id = admin._id as ObjectId
  const role = admin.role as string

  try {
    const result = await adminService.login({ user_id: user_id.toString(), role })
    return res.status(200).json({ message: 'login thanh cong', result })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}
export const GetallAdmin = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getallAdmin()
    return res.status(200).json({ message: 'lay danh sach thanh cong', result })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}
