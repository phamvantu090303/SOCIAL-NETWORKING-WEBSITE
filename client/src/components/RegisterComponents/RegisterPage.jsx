import { DatePicker, Form, Input, message, Typography } from 'antd'
import Button from '../Button'
import Link from '../Link'
import { axiosInstance } from '../../axios'
import { useNavigate } from 'react-router-dom'
const { Title } = Typography

const RegisterPage = () => {
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()
  const handleSubmit = (values) => {
    values.date_of_birth = values.date_of_birth.toDate()

    console.log('Form values:', values)
    axiosInstance
      .post('/api/register', values)
      .then((res) => {
        messageApi.success('Đã đăng ký tài khoản thành công')
        navigate('/login')
      })
      .catch((error) => {
        console.log(error)
        messageApi.error('Đã có lỗi xảy ra')
        for (const key of Object.keys(error?.response?.data?.errors)) {
          messageApi.error(error?.response?.data?.errors[key].msg, 2)
        }
      })
  }

  return (
    <main className='flex overflow-auto justify-around items-center px-20 text-lg bg-white   h-[100vh]'>
      <div className='flex flex-col max-w-full w-[450px]'>
        {contextHolder}
        <Title level={1} className='self-start mt-9 text-5xl font-black text-black max-md:ml-2.5'>
          Register to Twitter
        </Title>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name='name' rules={[{ required: true, message: 'Please input your name!' }]}>
            <Input type='text' placeholder='Name' className='mt-4 h-16' aria-label='name' />
          </Form.Item>
          <Form.Item name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input type='text' placeholder='User name' className='mt-4 h-16' aria-label='username' />
          </Form.Item>
          <Form.Item
            name='email'
            rules={[
              { required: true, message: 'Please input your email or phone number!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input type='text' placeholder='Email address' className='mt-4 h-16' aria-label='Email address' />
          </Form.Item>
          <Form.Item name='date_of_birth' rules={[{ required: true, message: 'Please input your dob!' }]}>
            <DatePicker className='mt-4 h-16 w-full' />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input type='password' placeholder='Password' className='mt-4 h-16' aria-label='Password' />
          </Form.Item>
          <Form.Item name='confirm_password' rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input type='password' placeholder='Confirm Password' className='mt-4 h-16' aria-label='Password' />
          </Form.Item>
          <Form.Item>
            <Button
              className='mt-4 w-full h-12
            '
              htmlType='submit'
            >
              Register
            </Button>
          </Form.Item>
        </Form>
        <div className='flex gap-5 justify-between mt-2 text-sky-500 max-md:max-w-full'>
          <Link href='/login'>Login to Twitter</Link>
        </div>
      </div>
    </main>
  )
}

export default RegisterPage
