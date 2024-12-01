const ProfileTabs = () => {
  return (
    <nav className='flex flex-col pt-4 w-full text-base font-bold max-w-[598px] max-md:max-w-full'>
      <div className='flex flex-wrap gap-10 max-w-full w-[558px]'>
        <div className='flex flex-auto gap-10 items-start'>
          <div className='flex flex-col mt-1 text-sky-500 whitespace-nowrap'>
            <div className='z-10 self-center -mt-1'>Tweets</div>
            <div className='flex shrink-0 mt-4 h-0.5 bg-sky-500' />
          </div>
          <div className='text-center text-slate-500'>Tweets & replies</div>
        </div>
        <div className='flex gap-10 self-start text-center whitespace-nowrap text-slate-500'>
          <div>Media</div>
          <div>Likes</div>
        </div>
      </div>
      <div className='flex shrink-0 h-px bg-gray-200 max-md:max-w-full' />
    </nav>
  )
}

export default ProfileTabs
