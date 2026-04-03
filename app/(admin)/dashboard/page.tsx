import AdminDashboard from '@/components/AdminDash';
import { checkUser } from '@/lib/clerk'

export default async function page() {
    const user = await checkUser()
  return (
    <AdminDashboard/>
  )
}


