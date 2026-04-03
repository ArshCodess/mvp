"use client";

import { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, Loader2, Heart, ArrowRight, Search } from "lucide-react";
import Link from "next/link";

type Registration = {
  id: string;
  userId: string;
  eventId: string;
  name: string;
  enrollmentNumber: string;
  course: string;
  year: number;
  group: string;
  phoneNumber: string;
  registeredAt: Date;
  status: string;
  event: {
    id: string;
    title: string;
    date: Date;
    description?: string;
    location?: string;
    category?: string;
    imageUrl?: string;
  };
};

export default function AppliedPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("api/applied");
      if (!response.ok) throw new Error("Failed to fetch registrations");

      const data = await response.json();
      setRegistrations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  // Filter registrations
  const filteredRegistrations = registrations.filter((reg) => {
    const eventDate = new Date(reg.event.date);
    const today = new Date();
    const matchesSearch = reg.event.title.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "upcoming") return eventDate >= today;
    if (filter === "past") return eventDate < today;
    return true;
  });

  const upcomingCount = registrations.filter(
    (reg) => new Date(reg.event.date) >= new Date()
  ).length;

  const pastCount = registrations.filter(
    (reg) => new Date(reg.event.date) < new Date()
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br  from-indigo-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchRegistrations}
            className="px-6 py-3 bg-gradient-to-br from-indigo-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                My Events
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {registrations.length} event{registrations.length !== 1 ? "s" : ""} registered
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-600">
                {registrations.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Total</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">
                {upcomingCount}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Upcoming</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl font-bold text-gray-600">
                {pastCount}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Past</div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 bg-white rounded-xl p-1 border border-gray-200 w-full sm:w-auto">
              <button
                onClick={() => setFilter("all")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "all"
                    ? "bg-gradient-to-br from-indigo-500 to-pink-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("upcoming")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "upcoming"
                    ? "bg-gradient-to-br from-indigo-500 to-pink-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter("past")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "past"
                    ? "bg-gradient-to-br from-indigo-500 to-pink-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Past
              </button>
            </div>
          </div>
        </div>

        {/* Events List */}
        {filteredRegistrations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? "No matching events" : "No events yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Start exploring and register for exciting campus events!"}
            </p>
            {!searchQuery && (
              <Link href="/events">
                <button className="px-6 py-3 bg-gradient-to-br from-indigo-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                  Explore Events
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRegistrations.map((registration) => (
              <EventCard key={registration.id} registration={registration} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ registration }: { registration: Registration }) {
  const eventDate = new Date(registration.event.date);
  const registeredDate = new Date(registration.registeredAt);
  const isPast = eventDate < new Date();

  const daysUntil = Math.ceil(
    (eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link href={`/events/${registration.event.id}`}>
      <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-pink-100 overflow-hidden">
          {registration.event.imageUrl ? (
            <img
              src={registration.event.imageUrl}
              alt={registration.event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-16 h-16 text-indigo-300" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            {isPast ? (
              <span className="px-3 py-1 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                Completed
              </span>
            ) : daysUntil <= 7 ? (
              <span className="px-3 py-1 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
                <span className="animate-pulse">⚡</span> {daysUntil} days left
              </span>
            ) : (
              <span className="px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                Registered
              </span>
            )}
          </div>

          {/* Category */}
          {registration.event.category && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-semibold rounded-full">
                {registration.event.category}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2  transition-colors">
            {registration.event.title}
          </h3>

          {registration.event.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {registration.event.description}
            </p>
          )}

          <div className="space-y-2 mt-auto">
            {/* Event Date */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span className="truncate">
                {eventDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Event Time */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span className="truncate">
                {eventDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* Location */}
            {registration.event.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="truncate">{registration.event.location}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Registered {registeredDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            <div className="flex items-center gap-1 text-indigo-600 text-sm font-semibold group-hover:gap-2 transition-all">
              View Details
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}