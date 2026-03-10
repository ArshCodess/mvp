import AppliedPage from '@/components/AppliedPage'
import WelcomeBanner from '@/components/welcomebanner'
import { checkUser } from '@/lib/clerk'
import React from 'react'

async function page() {
  const user = await checkUser()
  return (
    <div className='w-full'>
        <WelcomeBanner/>
        <AppliedPage/>
    </div>
  )
}

export default page