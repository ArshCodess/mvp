import UpdateEventPage from '@/components/UpdateEvent'
import React from 'react'

async function page({params}:{params:Promise<{eventId:string}>}) {
  const { eventId } = await params;
  return (
    <UpdateEventPage eventId={eventId}/>
  )
}

export default page