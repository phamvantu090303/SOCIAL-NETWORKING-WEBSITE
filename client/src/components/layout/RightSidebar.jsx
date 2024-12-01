import SearchBar from './SearchBar'
import WhatsHappening from './WhatsHappening'
import WhoToFollow from './WhoToFollow'

function RightSidebar() {
  return (
    <aside className='flex overflow-hidden flex-col min-h-[897px] min-w-[288px] max-w-[300px] display-none-lg'>
      <div className='fixed top-1 rounded-[20px] overflow-y-auto min-h-[100px] max-h-[1000px]'>
        <SearchBar />
        <WhatsHappening />
        <WhoToFollow />
        <footer className='mt-4 text-sm font-medium text-slate-500'>
          Terms of Service Privacy Policy Cookie Policy <br /> Ads info More © 2021 Twitter, Inc.
        </footer>
      </div>
    </aside>
  )
}

export default RightSidebar
