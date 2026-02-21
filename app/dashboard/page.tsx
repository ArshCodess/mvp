import CreateEventForm from '@/components/dashboard';
import { checkUser } from '@/lib/clerk'
import React, { FormEvent } from 'react'

export default async function page() {
    const user = await checkUser()
  return (
    <div>dashboard page
        <CreateEventForm/>

    </div>
  )
}


