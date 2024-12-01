import { Form, Input, message, Typography } from 'antd'
import Link from '../Link.jsx'
import Button from '../Button.jsx'
import { axiosInstance } from '../../axios.js'
import { useAuth } from '../../store.js'
import { useNavigate } from 'react-router-dom'

const { Title } = Typography

const LoginPage = () => {
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()
  const { setUser, user } = useAuth()
  console.log(user)
  const navigate = useNavigate()

  const handleSubmit = (values) => {
    // Thử đăng nhập với API user thường trước
    axiosInstance
      .post('/api/login', values)
      .then((res) => {
        localStorage.setItem('access_token', res.data.access_token)
        localStorage.setItem('refregh_token', res.data.refregh_token)
        axiosInstance
          .get('/api/me')
          .then((res) => {
            const userData = res.data.result
            setUser(userData)
            if (!userData.role) {
              navigate('/home')
            } else {
              navigate('/admin')
            }
          })
          .catch((error) => {
            console.log(error)
          })
      })
      .catch((userError) => {
        console.log(userError)
        messageApi.error('Login failed for user. Trying admin login...')
        axiosInstance
          .post('/admin/login', values)
          .then((res) => {
            localStorage.setItem('access_token', res.data.access_token)
            //đoạn này có thể thêm api lấy thông tin admin để view ra
            navigate('/admin')
          })
          .catch((adminError) => {
            console.log(adminError)

            // Hiển thị lỗi nếu cả hai API đều thất bại
            for (const key of Object.keys(adminError?.response?.data?.errors || {})) {
              messageApi.error(adminError?.response?.data?.errors[key].msg, 2)
            }
          })
      })
  }

  return (
    <main className='flex overflow-hidden items-center text-lg bg-white'>
      <img loading='lazy' src='./images/VAsocial.svg' className='object-cover w-[60%]' alt='Twitter logo' />
      <div className='flex flex-col w-[450px] bg-slate-200 p-5 rounded-md'>
        {contextHolder}
        <Title level={1} className='self-start mt-9 text-5xl font-black text-black max-md:ml-2.5'>
          Log in to VAsocial
        </Title>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name='email'
            rules={[
              { required: true, message: 'Please input your email or phone number!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input
              type='text'
              placeholder='Phone number, email address'
              className='mt-9 h-16'
              aria-label='Phone number or email address'
            />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input type='password' placeholder='Password' className='mt-6 h-16' aria-label='Password' />
          </Form.Item>
          <Form.Item>
            <Button className='mt-6 w-full h-12' htmlType='submit'>
              Log In
            </Button>
          </Form.Item>
        </Form>
        <div className='flex gap-5 justify-between mt-10 text-sky-500 max-md:max-w-full'>
          <Link href='/forgot-password'>Forgot password?</Link>
          <Link href='/register'>Sign up to Twitter</Link>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
