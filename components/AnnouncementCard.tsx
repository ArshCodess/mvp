import { Megaphone, Clock } from 'lucide-react';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  max_participants: number;
  image_url?: string;
  created_at: string;
}

interface Announcement {
  id: string;
  event_id: string;
  title: string;
  message: string;
  created_at: string;
  event?: Event;
  isNew?: boolean;
}

interface AnnouncementCardProps {
  announcement: Announcement;
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="group relative bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl border border-indigo-100 p-6 hover:shadow-lg transition-all duration-300">
      {announcement.isNew && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-lg">
            New
          </span>
        </div>
      )}

      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-gray-900 mb-2">
            {announcement.title}
          </h4>
          <p className="text-sm text-gray-700 mb-3 leading-relaxed">
            {announcement.message}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-600">
              {announcement.event?.title}
            </span>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {timeAgo(announcement.created_at)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
