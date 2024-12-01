import { Request, Response } from 'express'
import usersService from '../../services/users.services'

export const AllaccCount = async (req: Request, res: Response) => {
  const result = await usersService.getAllUser()
  return res.status(200).json({ success: true, message: 'Lấy danh sách User thang công ', result })
}
export const DetailAccCount = async (req: Request, res: Response) => {
  const user_id = req.params.user_id
  const data = await usersService.getDetailUser(user_id)
  return res.status(200).json({
    message: 'Lấy Thông tin Thành Công',
    data
  })
}

export const DeleteUser = async (req: Request, res: Response) => {
  const user_id = req.params.user_id
  const data = await usersService.DeleteUser(user_id)
  return res.status(200).json({
    message: 'Delete Thành Công',
    data
  })
}
