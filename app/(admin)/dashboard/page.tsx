import AdminDashboard from '@/components/AdminDash';
import CreateEventForm from '@/components/dashboard';
import { checkUser } from '@/lib/clerk'
import React, { FormEvent } from 'react'

export default async function page() {
    const user = await checkUser()
  return (
    <AdminDashboard/>
  )
}


