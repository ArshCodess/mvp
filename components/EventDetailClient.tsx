"use client";

import { useEffect, useMemo, useState } from "react";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  createdAt: string;
  imageUrl?: string | null;
};

type Props = {
  eventId: string;
};

export default function EventDetailClient({ eventId }: Props) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  /* ✅ Hooks ALWAYS run */
  const today = new Date();
  const eventDate = event ? new Date(event.date) : null;

  const daysLeft = useMemo(() => {
    if (!eventDate) return null;
    const diff = eventDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [eventDate]);

  const isClosed = daysLeft !== null && daysLeft < 0;

  const daysColor =
    daysLeft === null
      ? "text-gray-400"
      : daysLeft <= 0
      ? "text-red-500"
      : daysLeft <= 2
      ? "text-orange-500"
      : "text-green-600";

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        const data = await res.json();

        setEvent(data.event);
        setIsRegistered(data.isRegistered);
      } catch (err) {
        console.error("Failed to fetch event", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  /* ✅ Conditional returns AFTER hooks */
  if (loading) {
    return <EventDetailSkeleton />;
  }

  if (!event) {
    return (
      <div className="text-center py-20 text-gray-500">
        Event not found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md border border-pink-100 overflow-hidden">
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-56 w-full object-cover"
        />
      )}

      <div className="p-6 sm:p-8 space-y-5">
        <h1 className="text-2xl sm:text-3xl font-semibold text-pink-600">
          {event.title}
        </h1>

        <p className="text-gray-600">{event.description}</p>

        <p className={`font-medium ${daysColor}`}>
          {daysLeft === null
            ? "Loading..."
            : daysLeft > 0
            ? `${daysLeft} days left`
            : daysLeft === 0
            ? "Last day to register"
            : "Registration closed"}
        </p>
      </div>
    </div>
  );
}

/* Skeleton unchanged */
function EventDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md border border-pink-100 overflow-hidden animate-pulse">
      <div className="h-56 bg-pink-100" />
      <div className="p-6 space-y-4">
        <div className="h-6 w-2/3 bg-pink-100 rounded" />
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
