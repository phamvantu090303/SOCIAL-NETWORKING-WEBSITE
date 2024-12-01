const ProfileHeader = ({ name, tweetCount, avatarSrc }) => {
  return (
    <header className='flex overflow-hidden flex-col pt-2 w-full max-w-[598px] max-md:max-w-full'>
      <div className='flex self-start ml-4 max-md:ml-2.5'>
        <img
          loading='lazy'
          src={avatarSrc}
          alt={`${name}'s profile picture`}
          className='object-contain shrink-0 my-auto aspect-[2.46] w-[59px]'
        />
        <div className='flex flex-col'>
          <h1 className='text-xl font-bold text-neutral-900'>{name}</h1>
          <p className='text-sm font-medium text-slate-500'>{tweetCount} Tweets</p>
        </div>
      </div>
      <div className='flex shrink-0 mt-1.5 h-px bg-gray-200 max-md:max-w-full' />
    </header>
  )
}

export default ProfileHeader
