import { useAuth } from '../../store'
import { useNavigate } from 'react-router-dom'

function ProfileButton() {
  const { user } = useAuth()
  const navigate = useNavigate()
  return (
    <button
      onClick={() => {
        navigate('/profile')
      }}
      className='flex gap-5  2xl:mt-56 mt-6 xl:justify-evenly justify-center text-base xl:w-[255px] bg-slate-100'
    >
      <div className='flex items-center '>
        <img
          loading='lazy'
          src={user?.cover_photo || './images/iconavatar.jpg'}
          alt=''
          className='object-contain shrink-0 aspect-square rounded-[99999px] w-[30px] h-[30px] '
        />
        <div className='flex flex-col display-none-xl'>
          <div className='self-start font-bold text-neutral-900'>{user?.name}</div>
          {user?.username && <div className='font-medium tracking-tight text-slate-500'>@ {user?.username}</div>}
        </div>
      </div>
      <img
        loading='lazy'
        src='/images/more-options.svg'
        alt='More options'
        className='object-contain shrink-0 my-auto aspect-square w-[33px] display-none-xl'
      />
    </button>
  )
}

export default ProfileButton
