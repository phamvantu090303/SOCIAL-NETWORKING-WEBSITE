import { Request, Response, NextFunction, RequestHandler } from 'express'
//wrapRequestHandler = (funcRegitter: RequestHandler) nhận dử liệu từ function registerController truyền vào
export const wrapRequestHandler = (funcRegitter: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //này có 3 tham số req: Request, res: Response, next: NextFunction gọi là request handler
    try {
      // và nếu request handler có lổi thì chỉ đẩy lổi qua cho erorr handler sử lý chứ nó không thể xuất lổi ra ngoài
      await funcRegitter(req, res, next) //funcRegitter chính là funtion registerController và chờ cho registerController chạy nếu có lổi thì đẩy qua cho err handler xử lý và xuất lổi ra
    } catch (error) {
      next(error) //nếu bên uers.controler có lổi nó sẽ next  qua bên này và bên này nhận lổi next qua bên err handler để xuất lổi ra ngoài bên tran chính index.ts
    }
  }
}
