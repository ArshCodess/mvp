import { Event, User } from '@/app/generated/prisma/client';
import { Calendar, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';

interface EventCardProps {
    event: Event & {
        createdBy: User
    }
}

export default function EventCard({ event }: EventCardProps) {

  if (!event) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-100',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          label: 'Confirmed',
        };
      case 'rejected':
        return {
          icon: XCircle,
          bgColor: 'bg-red-100',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          label: 'Rejected',
        };
      default:
        return {
          icon: Clock,
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-700',
          borderColor: 'border-amber-200',
          label: 'Pending',
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="group w-full relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* {hasNewUpdate && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
          Updated
        </div>
      )} */}

      <div className="relative h-48 overflow-hidden">
        {event.imageUrl && <img
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={event.imageUrl || ''}
        />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-900 rounded-full">
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {event.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
            <span>{new Date(event.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}</span>
            <Clock className="w-4 h-4 ml-4 mr-2 text-indigo-500" />
            <span>{new Date(event.date).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className={`flex items-center justify-between px-4 py-3 rounded-xl ${statusConfig.bgColor} border ${statusConfig.borderColor}`}>
          <div className="flex items-center space-x-2">
            <StatusIcon className={`w-5 h-5 ${statusConfig.textColor}`} />
            <span className={`text-sm font-semibold ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
