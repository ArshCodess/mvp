"use client"
import { useUser } from '@/hooks/UserProvider';
import { Sparkles, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface UserProps {
  name: string;
  enrollment: number;
  course: string;
  group: string;
}

export default function WelcomeBanner() {
  const { user: data, isLoading } = useUser();
  const router = useRouter();
  data && console.log("User in banner:", data);
  const user = data?.universityDetails
  const [isExpanded, setIsExpanded] = useState(false)
  if (isLoading)
    return <div>Loading.....</div>
  return (
    <div className="relative overflow-hidden bg-gradient-to-br w-full from-indigo-500 via-purple-500 to-pink-500 rounded-3xl rounded-t-none shadow-xl">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

      <div className="relative p-8 md:p-10">
        {/* Content Container with smooth height transition */}
        <div
          className={`
            flex flex-col md:flex-row items-center justify-between
            transition-all duration-500 ease-in-out overflow-hidden
            ${isExpanded ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 py-0'}
          `}
        >
          <div className="flex-1 self-start mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-2 md:mb-3">
              <Sparkles className="md:w-6 w-4 h-4 md:h-6 text-yellow-300" />
              <span className="text-white/90 text-sm font-semibold">Welcome back</span>
            </div>
            <h1 className="text-xl md:text-4xl font-bold text-white mb-2 md:mb-3">
              Hi, {user?.name || "Guest"}!
            </h1>
            <p className="md:text-lg text-xs text-white/80 max-w-lg leading-relaxed">
              Ready for your upcoming campus events?
            </p>
            {
              user ? (
                <div className='text-white/80 list-none text-xs border-l-4 w-lg mt-3 rounded-sm border-white/30 px-3 py-2 bg-white/5 backdrop-blur-sm'>
                  <li className="mb-1">Enr: {user?.enrollmentNumber}</li>
                  <li className="mb-1">Course: {user?.course}-{user?.year}</li>
                  <li>Group: {user?.group}</li>
                </div>
              ) : (
                <div>
                  <div className='text-white/80 text-xs border-l-4 w-lg mt-3 rounded-sm border-white/30 px-3 py-2 bg-white/5 backdrop-blur-sm'>
                  <p>Please complete your university profile to get personalized event recommendations.</p>
                </div>
                  <button onClick={()=>{      
                    router.push('/profile')            
                  }} className="mt-2 text-sm text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">Complete Profile</button>
                </div>
              )
            }
          </div>

          <div className="flex-shrink-0 hidden md:block">
            <div className="relative w-64 h-48 ">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-3">
                  <div className="h-3 bg-white/30 rounded-full w-3/4" />
                  <div className="h-3 bg-white/30 rounded-full w-full" />
                  <div className="h-3 bg-white/30 rounded-full w-2/3" />
                  <div className="mt-6 flex space-x-2">
                    <div className="w-8 h-8 bg-white/40 rounded-lg" />
                    <div className="w-8 h-8 bg-white/40 rounded-lg" />
                    <div className="w-8 h-8 bg-white/40 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="
            absolute bottom-3 left-1/2 -translate-x-1/2
            flex items-center justify-center
            w-12 h-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm
            rounded-full border border-white/30
            transition-all duration-300 ease-in-out
            group
          "
          aria-label={isExpanded ? "Collapse banner" : "Expand banner"}
        >
          <ChevronDown
            className={`
              w-4 h-4 text-white
              transition-transform duration-300 ease-in-out
              ${isExpanded ? 'rotate-180' : 'rotate-0'}
              group-hover:scale-110
            `}
          />
        </button>
      </div>
    </div>
  );
}