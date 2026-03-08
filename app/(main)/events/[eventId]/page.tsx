"use client";

import { useUser } from "@/hooks/UserProvider";
import { register } from "module";
import { useParams } from "next/navigation";
import { JSX, useEffect, useMemo, useState } from "react";

/* ─────────────────────────── Types ─────────────────────────── */

type EventLink = {
    id: string;
    label: string;
    url: string;
    type: "WHATSAPP" | "MEET" | "ZOOM" | "DISCORD" | "YOUTUBE" | "OTHER";
};

type Reward = {
    id: string;
    icon: string;
    title: string;
    description: string;
};

type Highlight = {
    id: string;
    text: string;
};

type Registration = {
    userId: string;
    user: {
        id: string;
        name: string;
    };
};

type Event = {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    imageUrl?: string | null;
    capacity: number;
    highlights: Highlight[];
    rewards: Reward[];
    links: EventLink[];
    registrations: Registration[];
    _count: {
        registrations: number;
        announcements: number;
    };
};

/* ─────────────────── Link type config ──────────────────────── */

const LINK_META: Record<
    EventLink["type"],
    { label: string; icon: JSX.Element; bg: string; text: string }
> = {
    WHATSAPP: {
        label: "WhatsApp Group",
        bg: "bg-green-50 border-green-200 hover:bg-green-100",
        text: "text-green-700",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        ),
    },
    MEET: {
        label: "Google Meet",
        bg: "bg-blue-50 border-blue-200 hover:bg-blue-100",
        text: "text-blue-700",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
            </svg>
        ),
    },
    ZOOM: {
        label: "Zoom Meeting",
        bg: "bg-sky-50 border-sky-200 hover:bg-sky-100",
        text: "text-sky-700",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
            </svg>
        ),
    },
    DISCORD: {
        label: "Discord Server",
        bg: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
        text: "text-indigo-700",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
            </svg>
        ),
    },
    YOUTUBE: {
        label: "YouTube Live",
        bg: "bg-red-50 border-red-200 hover:bg-red-100",
        text: "text-red-700",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
            </svg>
        ),
    },
    OTHER: {
        label: "Link",
        bg: "bg-gray-50 border-gray-200 hover:bg-gray-100",
        text: "text-gray-700",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
        ),
    },
};

/* ─────────────────── Component ─────────────────────────────── */

export default function EventDetailClient({
    params,
}: {
    params: Promise<{ eventId: string }>;
}) {
    const [event, setEvent] = useState<Event | null>(null);
    const [canRegister, setCanRegister] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const { eventId } = useParams();
    const today = new Date();
    const eventDate = event ? new Date(event.date) : null;
    const { user, isLoading } = useUser();

    const daysLeft = useMemo(() => {
        if (!eventDate) return null;
        return Math.ceil(
            (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
    }, [eventDate]);

    const isClosed = daysLeft !== null && daysLeft <= 0;

    useEffect(() => {
        if (isLoading || !user) return;

        const fetchEvent = async () => {
            try {
                const res = await fetch(`/api/events/${eventId}`);
                const data = await res.json();

                const isUserRegistered = data?.registrations?.some(
                    (item: Registration) => item.userId === user?.user.id
                );

                setIsRegistered(!!isUserRegistered);
                setEvent(data);
            } catch (error) {
                console.error("Fetch failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId, user, isLoading]);

    if (loading) return <PageSkeleton />;
    if (!event) return <EmptyState />;

    /* ── Derived stats from API data ── */
    var registeredCount = event._count?.registrations ?? 0;
    const capacity = event.capacity ?? 0;
    var spotsRemaining = Math.max(0, capacity - registeredCount);

    const handleRegister = async () => {
        if (!user?.universityDetails) {
            setCanRegister(false);
        } else {
            const response = await fetch(`/api/events/${event.id}/register`, {
                method: "POST",
                body: JSON.stringify(user.universityDetails),
            });
            if (!response.ok) {
                alert("Registration failed. Please try again.");
            } else {
                setIsRegistered(true);
                registeredCount++;
                spotsRemaining = Math.max(0, capacity - registeredCount);
            }
        }
    };

    const handleShare = async () => {
        const shareUrl = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: "Check out this event!", url: shareUrl });
            } catch (err) {
                console.log("Share cancelled", err);
            }
        } else {
            await navigator.clipboard.writeText(shareUrl);
            alert("Event link copied to clipboard! 🎉");
        }
    };

    /* ── Shared sub-components ── */
    const RegisterButton = ({ size = "lg" }: { size?: "sm" | "lg" }) => {
        const py = size === "lg" ? "py-3 md:py-4" : "py-3 sm:py-4";
        const text = size === "lg" ? "text-base md:text-lg" : "text-xs sm:text-sm";

        if (isClosed)
            return (
                <button disabled className={`w-full ${py} rounded-xl bg-gray-100 text-gray-400 font-semibold ${text}`}>
                    Registration Closed
                </button>
            );

        if (isRegistered)
            return (
                <div className="w-full">
                    <button disabled className={`w-full ${py} px-3 sm:px-4 rounded-xl bg-green-50 border-2 border-green-500 text-green-700 font-semibold ${text} flex items-center justify-center gap-2`}>
                        <span>✓</span> You're Registered!
                    </button>
                    <p className="text-xs sm:text-sm text-center text-green-600 mt-2 sm:mt-3">
                        Check your email for confirmation
                    </p>
                </div>
            );

        return (
            <button
                onClick={handleRegister}
                className={`w-full ${py} rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold ${text} shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
            >
                Register Now
            </button>
        );
    };

    const ShareButton = ({ size = "lg" }: { size?: "sm" | "lg" }) => {
        const py = size === "lg" ? "py-2.5 md:py-3" : "py-3 sm:py-4";
        const text = size === "lg" ? "text-sm md:text-base" : "text-xs sm:text-sm";
        return (
            <button
                onClick={handleShare}
                className={`w-full ${py} rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 ${text}`}
            >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className={size === "sm" ? "hidden sm:inline" : ""}>Share Event</span>
            </button>
        );
    };

    const UrgencyBanner = () =>
        !isClosed && daysLeft !== null && daysLeft <= 7 ? (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="flex items-center gap-2 text-orange-700 text-xs sm:text-sm font-semibold">
                    <span className="text-base sm:text-xl">⏰</span>
                    <span>{daysLeft <= 2 ? "Last chance to register!" : `Only ${daysLeft} days left!`}</span>
                </div>
            </div>
        ) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br w-full space-y-4 from-pink-50 via-white to-purple-50 lg:mx-2">

            {/* ── Profile completion dialog ── */}
            {!canRegister && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border max-w-md mx-4">
                        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Complete Your Profile</h2>
                        <p className="text-sm sm:text-base mb-4 sm:mb-6">
                            Please add your university details to register for events.
                        </p>
                        <button
                            onClick={() => { window.location.href = "/profile"; }}
                            className="w-full py-2.5 sm:py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white text-sm sm:text-base font-medium rounded-lg transition-colors"
                        >
                            Complete Profile
                        </button>
                    </div>
                </div>
            )}

            {/* ── HERO ── */}
            <section className="relative rounded-b-2xl overflow-hidden">
                {event.imageUrl && (
                    <img src={event.imageUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover opacity-95" />
                )}
                {/* Dark gradient overlay for text contrast */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.35) 40%, rgba(0, 0, 0, 0.55) 100%)",
                    }}
                />
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-12 sm:py-16 md:py-32 md:pt-20">
                    <div className="flex  items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-medium border border-white/30">
                            {event.category}
                        </span>
                        {!isClosed && (
                            <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-yellow-400 text-yellow-900 text-xs sm:text-sm font-bold flex items-center gap-1">
                                <span className="animate-pulse">⚡</span> Registration Open
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-1 sm:mb-4 leading-tight">
                        {event.title}
                    </h1>
                    {/* <p className="text-xs h-min sm:h-full w-full overflow-scroll  text-ellipsis sm:text-lg md:text-xl text-pink-100 max-w-3xl mb-2 sm:mb-8 leading-relaxed whitespace-pre-wrap" style={{scrollbarWidth:"none"}}>
                        {event.description}
                    </p> */}

                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-white/90 text-xs sm:text-base">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">
                                {eventDate!.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">
                                {eventDate!.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium">{event.location}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS ── */}
            <section className="max-w-6xl lg:mx-auto lg:px-6 -mt-8 sm:-mt-12 relative z-10">
                <div className="bg-white rounded-2xl lg:shadow-xl lg:border rounded-b-none lg:rounded-b-2xl md:border-gray-100 p-4 sm:p-6 md:p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        {/* Registered */}
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                {registeredCount}
                            </div>
                            <div className="text-gray-600 text-xs sm:text-sm md:text-base mt-1 sm:mt-2">Registered</div>
                            {capacity > 0 && (
                                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-2 sm:mt-3">
                                    <div
                                        className="bg-gradient-to-r from-pink-600 to-purple-600 h-1.5 sm:h-2 rounded-full"
                                        style={{ width: `${Math.min((registeredCount / capacity) * 100, 100)}%` }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Capacity */}
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                                {capacity > 0 ? capacity : "∞"}
                            </div>
                            <div className="text-gray-600 text-xs sm:text-sm md:text-base mt-1 sm:mt-2">Total Capacity</div>
                        </div>

                        {/* Spots left */}
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                                {capacity > 0 ? spotsRemaining : "Open"}
                            </div>
                            <div className="text-gray-600 text-xs sm:text-sm md:text-base mt-1 sm:mt-2">Spots Left</div>
                        </div>

                        {/* Days to go */}
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                                {daysLeft !== null && daysLeft > 0 ? daysLeft : 0}
                            </div>
                            <div className="text-gray-600 text-xs sm:text-sm md:text-base mt-1 sm:mt-2">
                                {isClosed ? "Event Ended" : "Days to Go"}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MOBILE REGISTRATION ── */}
            <div className="bg-white lg:hidden shadow-md border-gray-100 p-4 sm:p-6 pt-0">
                <UrgencyBanner />
                <div className="flex items-center relative space-x-2 transition">
                    <RegisterButton size="sm" />
                    <ShareButton size="sm" />
                </div>
                {!isClosed && capacity > 0 && (
                    <div className="mt-4 sm:mt-6 pt-3 sm:pt-5">
                        <p className="text-xs sm:text-sm text-gray-600 text-center">
                            {spotsRemaining} spots remaining
                        </p>
                    </div>
                )}
            </div>

            {/* ── MAIN CONTENT ── */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:pb-16 grid lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12 relative mb-20">
                {/* ──── LEFT COLUMN ──── */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8 md:space-y-12 relative">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-fuchsia-200 p-4 sm:p-6 md:p-8">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">📖 Description</h1>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                    </div>
                    {/* Highlights */}
                    {event.highlights?.length > 0 && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                                <span className="text-2xl sm:text-3xl">✨</span>
                                Event Highlights
                            </h2>
                            <ul className="space-y-3 sm:space-y-4">
                                {event.highlights.map((highlight) => (
                                    <li key={highlight.id} className="flex items-start gap-2 sm:gap-3">
                                        <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white flex items-center justify-center text-xs sm:text-sm font-bold">
                                            ✓
                                        </span>
                                        <span className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {highlight.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Rewards */}
                    {event.rewards?.length > 0 && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl border border-purple-100 p-4 sm:p-6 md:p-8">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                                <span className="text-2xl sm:text-3xl">🎁</span>
                                What You'll Get
                            </h2>
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full">
                                {event.rewards.map((reward) => (
                                    <div key={reward.id} className="bg-white space-x-3 md:space-x-0 items-center flex md:block rounded-xl p-4 sm:p-6 md:text-center shadow-md hover:shadow-xl transition-shadow">
                                        <div className="text-3xl sm:text-4xl md:mb-3">{reward.icon}</div>
                                        <div>
                                            <h3 className="text-sm sm:text-base font-bold text-gray-900 md:mb-2 whitespace-pre-wrap">{reward.title}</h3>
                                            <p className="text-xs sm:text-sm text-gray-600 whitespace-pre-wrap">{reward.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── IMPORTANT LINKS ── */}
                    {event.links?.length > 0 && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8 ">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                                <span className="text-2xl sm:text-3xl">🔗</span>
                                Important Links
                            </h2>
                            <div className="grid gap-3 sm:gap-4">
                                {event.links.map((link) => {
                                    const meta = LINK_META[link.type] ?? LINK_META.OTHER;
                                    return (
                                        <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all group ${meta.bg}`}
                                        >
                                            {/* Icon bubble */}
                                            <span className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center ${meta.text} bg-white shadow-sm group-hover:scale-110 transition-transform`}>
                                                {meta.icon}
                                            </span>

                                            {/* Text */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm sm:text-base font-semibold ${meta.text} truncate`}>
                                                    {link.label || meta.label}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate w-[40vw] md:w-[20vw]">{link.url}</p>
                                            </div>

                                            {/* Arrow */}
                                            <svg className={`w-4 h-4 flex-shrink-0 ${meta.text} opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* ──── RIGHT SIDEBAR ──── */}
                <div className="space-y-6 hidden lg:block">
                    <div className="sticky top-6 space-y-6">

                        {/* Registration Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
                            <UrgencyBanner />
                            <RegisterButton size="lg" />
                            <div className="mt-4">
                                <ShareButton size="lg" />
                            </div>
                            {!isClosed && capacity > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-xs md:text-sm text-gray-600 text-center">
                                        {spotsRemaining} spots remaining
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Quick Info */}
                        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-100 p-4 md:p-6">
                            <h3 className="text-sm md:text-base font-bold text-gray-900 mb-3 md:mb-4">
                                Event Information
                            </h3>
                            <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Category</span>
                                    <span className="font-semibold text-gray-900">{event.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Capacity</span>
                                    <span className="font-semibold text-gray-900">
                                        {capacity > 0 ? capacity : "Unlimited"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Registered</span>
                                    <span className="font-semibold text-gray-900">{registeredCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Price</span>
                                    <span className="font-semibold text-green-600">FREE</span>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: Important Links (compact) */}
                        {event.links?.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
                                <h3 className="text-sm md:text-base font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                                    <span>🔗</span> Important Links
                                </h3>
                                <div className="space-y-2">
                                    {event.links.map((link) => {
                                        const meta = LINK_META[link.type] ?? LINK_META.OTHER;
                                        return (
                                            <a
                                                key={link.id}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all group ${meta.bg}`}
                                            >
                                                <span className={`flex-shrink-0 ${meta.text}`}>{meta.icon}</span>
                                                <span className={`text-xs font-semibold ${meta.text} truncate flex-1`}>
                                                    {link.label || meta.label}
                                                </span>
                                                <svg className={`w-3 h-3 flex-shrink-0 ${meta.text} opacity-50 group-hover:opacity-100`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ─────────────────── Skeleton ───────────────────────────────── */

function PageSkeleton() {
    return (
        <div className="min-h-screen w-full space-y-4 bg-gradient-to-br from-pink-50 via-white to-purple-50">
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-pink-500 opacity-95" />
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-20 lg:py-32 animate-pulse">
                    <div className="h-6 sm:h-8 w-24 sm:w-32 bg-white/20 rounded-full mb-3 sm:mb-6" />
                    <div className="h-10 sm:h-16 bg-white/20 rounded-lg mb-4 w-full max-w-2xl" />
                    <div className="h-6 bg-white/20 rounded-lg mb-2 w-full max-w-xl" />
                    <div className="h-6 bg-white/20 rounded-lg mb-8 w-full max-w-md" />
                    <div className="flex flex-wrap gap-4">
                        <div className="h-5 w-40 bg-white/20 rounded" />
                        <div className="h-5 w-32 bg-white/20 rounded" />
                        <div className="h-5 w-36 bg-white/20 rounded" />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 mb-8">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 animate-pulse">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="text-center">
                                <div className="h-8 w-16 bg-gray-200 rounded mx-auto mb-2" />
                                <div className="h-3 w-12 bg-gray-200 rounded mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 grid lg:grid-cols-3 gap-6 animate-pulse">
                <div className="lg:col-span-2 space-y-6">
                    <div className="h-48 bg-white rounded-2xl shadow-lg" />
                    <div className="h-48 bg-white rounded-2xl shadow-lg" />
                    <div className="h-40 bg-white rounded-2xl shadow-lg" />
                </div>
                <div className="h-80 bg-white rounded-2xl shadow-xl" />
            </div>
        </div>
    );
}

/* ─────────────────── Empty state ────────────────────────────── */

function EmptyState() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="text-5xl mb-4">😕</div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
                <p className="text-sm sm:text-base text-gray-600">
                    The event you're looking for doesn't exist or has been removed.
                </p>
            </div>
        </div>
    );
}