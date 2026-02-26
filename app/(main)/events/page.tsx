import CardGrid from '@/components/CardGrid'
import CardWithSearch from '@/components/CardWithSearch'
import Notifications from '@/components/Notifications'
import WelcomeBanner from '@/components/welcomebanner'
import { checkUser } from '@/lib/clerk'

function page() {
  const user = checkUser()
  return (
    <div className='md:flex md:gap-4 w-full'>
      <div className='w-full'>
        {/* <WelcomeBanner/> */}
        <CardWithSearch/>
      </div>
      <Notifications />
    </div>
  )
}

export default page;