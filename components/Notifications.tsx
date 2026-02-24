"use client"

import { Announcement, mockAnnouncements } from "@/lib/mockData";
import { useState } from "react";
import AnnouncementCard from "./AnnouncementCard";
import { Megaphone } from "lucide-react";

function Notifications() {
    const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
    return (
        <div style={{scrollbarWidth:"none"}} className="hidden lg:block space-y-6 px-3 border sticky rounded-b-2xl border-gray-200 top-0 h-[80vh] overflow-scroll scroll-smooth py-3 min-w-sm max-w-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 ml-2">Live Updates</h2>
                <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-500">Live</span>
                </span>
            </div>

            <div className="space-y-4">
                {announcements.map((announcement) => (
                    <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
            </div>

            {announcements.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Megaphone className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No announcements yet</p>
                </div>
            )}
        </div>
    )
}

export default Notifications