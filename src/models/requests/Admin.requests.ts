export interface admintype {
  username: string
  password: string
  email: string
  created_at: Date
  role: string
}
export interface adminLoginReqBody {
  email: string
  password: string
}
