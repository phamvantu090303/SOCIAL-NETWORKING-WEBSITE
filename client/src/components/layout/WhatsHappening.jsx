import { useEffect, useState } from 'react'
import { axiosInstance } from '../../axios'

function WhatsHappening() {
  const [newFews, setNewFews] = useState([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchSenderInfo = async () => {
      try {
        axiosInstance.get('/new').then((res) => {
          setNewFews(
            res.data.articles.map((article) => {
              return {
                id: article.source.id,
                category: article.category,
                time: article.time,
                title: article.title,
                trendingWith: article.source.name || 'N/A',
                image: article.urlToImage,
                url: article.url
              }
            })
          )
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchSenderInfo()
  }, [])
  const displayedFews = showAll ? newFews : newFews.slice(0, 1)

  return (
    <div className='flex overflow-y-auto flex-col w-full text-sm mt-3 font-medium rounded-2xl bg-slate-50 max-w-[350px] h-max-[300px] custom-scrollbar'>
      <div className='flex flex-col pt-3 w-full text-xl font-bold tracking-wide text-neutral-900'>
        <div className='self-start ml-4 max-md:ml-2.5'>Whats happening</div>
        <div className='flex shrink-0 mt-2.5 h-px bg-gray-200' />
      </div>
      {displayedFews.map((article) => (
        <a
          key={article.id}
          href={article.url}
          target='_blank'
          rel='noopener noreferrer'
          className='flex gap-4 items-start py-2.5 pr-3.5 pl-4 w-full border-b border-b-gray-400'
        >
          <div className='flex flex-col items-start w-[235px]'>
            <div className='flex gap-1 items-start text-slate-500'>
              <div>{article.category}</div>
              <div>{article.time}</div>
            </div>
            <div className='self-stretch mt-1.5 text-base font-bold tracking-wide text-neutral-900'>
              {article.title}
            </div>
            <div className='flex gap-1 items-start mt-1.5 tracking-tight'>
              <div className='text-slate-500'>Trending with</div>
              <div className='text-sky-500'>{article.trendingWith}</div>
            </div>
          </div>
          <img
            loading='lazy'
            src={article.image}
            alt={article.title}
            className='object-contain shrink-0 aspect-[1.03] w-[71px]'
          />
        </a>
      ))}
      <div onClick={() => setShowAll(!showAll)} className='p-4 w-full text-base text-sky-500 cursor-pointer'>
        {showAll ? 'Show less' : 'Show more'}
      </div>
    </div>
  )
}

export default WhatsHappening
