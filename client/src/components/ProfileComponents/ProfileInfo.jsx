const ProfileInfo = ({ name, username, bio, location, joinDate, following, followers }) => {
  return (
    <section className='flex flex-col items-start mt-3.5 ml-3.5 max-w-full text-base w-[270px] max-md:ml-2.5'>
      <h2 className='text-xl font-bold tracking-tight text-neutral-900'>{name}</h2>
      <p className='font-medium tracking-tight text-slate-500'>@{username}</p>
      <p className='mt-2.5 font-medium tracking-tight text-neutral-900'>{bio}</p>
      <div className='flex gap-2.5 items-start self-stretch mt-2.5 font-medium text-slate-500'>
        <div className='flex gap-1.5 tracking-tight whitespace-nowrap w-[76px]'>
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/81c7909f7666796674064c8c9ec5a6fd1f3b3173324435fb87782769146e610e?placeholderIfAbsent=true&apiKey=ee3b4c55f4e940649da4e87de99f1704'
            alt=''
            className='object-contain shrink-0 self-start aspect-square w-[19px]'
          />
          <span>{location}</span>
        </div>
        <div className='flex gap-1.5 tracking-tight w-[185px]'>
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/2a6fb05af19471d38154a4e9446356555ab664f2f6660b258df073860a09fdbe?placeholderIfAbsent=true&apiKey=ee3b4c55f4e940649da4e87de99f1704'
            alt=''
            className='object-contain shrink-0 self-start aspect-square w-[19px]'
          />
          <span className='basis-auto'>Joined {joinDate}</span>
        </div>
      </div>
      <div className='flex gap-5 mt-2.5 max-w-full whitespace-nowrap w-[207px]'>
        <div className='flex flex-1 gap-1 items-start'>
          <span className='font-bold text-neutral-900'>{following}</span>
          <span className='font-medium tracking-tight text-slate-500'>Following</span>
        </div>
        <div className='flex flex-1 gap-1.5 items-start'>
          <span className='font-bold text-neutral-900'>{followers}</span>
          <span className='font-medium tracking-tight text-slate-500'>Followers</span>
        </div>
      </div>
    </section>
  )
}

export default ProfileInfo
