"use client"
import { useState, useEffect } from "react";
import AnnouncementCard from "./AnnouncementCard";
import { Megaphone, Loader2, RefreshCw } from "lucide-react";
import { Announcement, Event, User } from "@/app/generated/prisma/client";


function Notifications() {
    const [announcements, setAnnouncements] = useState<(Announcement & {
        event?: Event;
        createdBy?: User;
    })[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch("/api/announcements");

            if (!response.ok) {
                throw new Error("Failed to fetch announcements");
            }

            const data = await response.json();
            console.log("API Response:", data);
            // Handle both array and object responses
            setAnnouncements(Array.isArray(data) ? data : data.announcements || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchAnnouncements();
        setIsRefreshing(false);
    };

    return (
        <div style={{ scrollbarWidth: "none" }} className="hidden lg:block space-y-6 px-3 border sticky rounded-b-2xl border-gray-200 top-0 h-[80vh] overflow-scroll scroll-smooth py-3 min-w-sm max-w-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 ml-2">Live Updates</h2>
                <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-gray-500">Live</span>
                    </span>
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Refresh announcements"
                    >
                        <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-gray-200">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                    <p className="text-gray-500 text-sm">Loading announcements...</p>
                </div>
            ) : error ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-3">Failed to load announcements</p>
                    <button
                        onClick={fetchAnnouncements}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            ) : announcements.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Megaphone className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No announcements yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map((announcement) => (
                        <AnnouncementCard key={announcement.id} announcement={announcement} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Notifications