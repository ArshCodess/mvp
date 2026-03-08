"use client"
import { UserButton } from '@clerk/nextjs';
import { Home, Calendar, Megaphone, Bell, User, Heart, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


const menuItems = [
  { id: 'applied', label: 'Applied', icon: Heart, href: '/applied' },
  { id: 'events', label: 'Explore', icon: Search, href: '/events' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications' },
  { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside className="h-screen top-0 hidden sticky lg:flex lg:w-64 bg-white border-r border-l border-gray-200">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              CampusHub
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link href={item.href} key={item.id}>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-indigo-50 to-pink-50 text-indigo-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-indigo-600' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-pink-50 rounded-xl">
            <p className="text-sm font-medium text-gray-900 mb-1">Need help?</p>
            <p className="text-xs text-gray-600 mb-3">Check our documentation</p>
            <button className="w-full px-3 py-2 bg-white text-indigo-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Get Support
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
