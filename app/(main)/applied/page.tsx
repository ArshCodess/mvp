import AppliedPage from '@/components/AppliedPage'
import WelcomeBanner from '@/components/welcomebanner'
import React from 'react'

function page() {
  return (
    <div className='w-full'>
        <WelcomeBanner/>
        <AppliedPage/>
    </div>
  )
}

export default page