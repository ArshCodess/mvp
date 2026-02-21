import { SignIn } from '@clerk/nextjs'
import React from 'react'

export default function page() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-0 from-pink-200 to-white'><SignIn/></div>
  )
}
