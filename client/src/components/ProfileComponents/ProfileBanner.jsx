const ProfileBanner = ({ src }) => {
  return (
    <div className='flex overflow-hidden flex-col bg-white max-md:max-w-full'>
      <div className='flex z-10 shrink-0 mb-0 h-[260px] max-md:mb-2.5 max-md:max-w-full'>
        <img src={src} alt='' />
      </div>
    </div>
  )
}

export default ProfileBanner
