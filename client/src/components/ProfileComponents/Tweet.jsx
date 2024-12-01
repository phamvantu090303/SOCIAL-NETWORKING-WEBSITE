const Tweet = ({ author, username, time, content, imageSrc, comments, retweets, likes, views }) => {
  return (
    <article className='flex flex-wrap gap-2.5 pr-px pl-4 mt-2.5 w-full max-w-[584px] max-md:max-w-full'>
      <div className='flex grow shrink items-start h-full w-[39px]'>
        <img
          loading='lazy'
          src='https://cdn.builder.io/api/v1/image/assets/TEMP/a56c91bef59ca6dafb970ac1cbc23aa339cd866e233985e0941734ae4fb1c5d7?placeholderIfAbsent=true&apiKey=ee3b4c55f4e940649da4e87de99f1704'
          alt={`${author}'s profile picture`}
          className='object-contain aspect-square rounded-[99999px] w-[49px]'
        />
      </div>
      <div className='flex flex-col grow shrink self-start min-w-[240px] w-[499px] max-md:max-w-full'>
        <div className='flex flex-wrap gap-1 items-center pb-1 w-full text-base font-medium text-slate-500 max-md:max-w-full'>
          <span className='self-stretch my-auto font-bold text-neutral-900'>{author}</span>
          <span className='self-stretch my-auto'>@{username}</span>
          <span className='self-stretch my-auto'>·</span>
          <span className='self-stretch my-auto'>{time}</span>
        </div>
        <p className='flex-1 shrink gap-2.5 w-full text-base font-medium text-neutral-900 max-md:max-w-full'>
          {content}
        </p>
        <div className='flex overflow-hidden items-start py-2.5 w-full rounded-2xl max-md:max-w-full'>
          <div className='flex overflow-hidden flex-col flex-1 shrink justify-center w-full rounded-2xl border border-solid basis-0 border-slate-400 min-w-[240px] max-md:max-w-full'>
            <img
              loading='lazy'
              src={imageSrc}
              alt='Tweet image'
              className='object-contain w-full aspect-[2.06] max-md:max-w-full'
            />
          </div>
        </div>
        <div className='flex overflow-hidden flex-wrap items-start py-1 w-full text-sm font-medium whitespace-nowrap text-slate-500 max-md:max-w-full'>
          <div className='flex grow shrink gap-2.5 w-[102px]'>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/c83e651773c869df5dae2bce97ff284813d8d1cdf0eefce9a062191c37d154b4?placeholderIfAbsent=true&apiKey=ee3b4c55f4e940649da4e87de99f1704'
              alt=''
              className='object-contain shrink-0 aspect-square w-[18px]'
            />
            <span>{comments}</span>
          </div>
          <div className='flex grow shrink gap-2.5 w-[102px]'>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/34da0172407ace773981b71785ce9a0a5a54928f086b1b3f26793e5084beef20?placeholderIfAbsent=true&apiKey=ee3b4c55f4e940649da4e87de99f1704'
              alt=''
              className='object-contain shrink-0 aspect-square w-[18px]'
            />
            <span>{retweets}</span>
          </div>
          <div className='flex grow shrink gap-2.5 text-rose-500 w-[102px]'>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/6db1418fed53c2a28badb5ba3eec9cd132e0bb48e74ddeb64e9591f4e27b4001?placeholderIfAbsent=true&apiKey=ee3b4c55f4e940649da4e87de99f1704'
              alt=''
              className='object-contain shrink-0 aspect-square w-[18px]'
            />
            <span>{likes}</span>
          </div>
          <div className='flex grow shrink gap-2.5 w-[102px]'>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/b52456e13cbd8b6dee4103d0a1d82c0d471a84d666722c9e76457535ce806d0d?placeholderIfAbsent=true&apiKey=ee3b4c55f4e940649da4e87de99f1704'
              alt=''
              className='object-contain shrink-0 aspect-square w-[18px]'
            />
            <span>{views}</span>
          </div>
        </div>
        <button className='overflow-hidden self-start py-2.5 text-sm font-medium text-sky-500'>Show this thread</button>
      </div>
    </article>
  )
}

export default Tweet
