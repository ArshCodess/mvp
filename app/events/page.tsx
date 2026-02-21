import CardGrid from '@/components/CardGrid'
import WelcomeBanner from '@/components/welcomebanner'
import { checkUser } from '@/lib/clerk'
import React from 'react'

function page() {
  const user = checkUser()
  return (
    <div className='max-w-5xl space-y-4'>
        <WelcomeBanner/>
        <CardGrid/>
    </div>
  )
}

export default page