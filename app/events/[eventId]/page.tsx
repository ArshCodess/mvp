"use client";

import { useUser } from "@/hooks/UserProvider";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Event = {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    imageUrl?: string | null;
};
export default function EventDetailClient({
    params,
}: {
    params: Promise<{ eventId: string }>;
}) {
    const [event, setEvent] = useState<Event | null>(null);
    const [canRegister, setCanRegister] = useState(true)
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const { eventId } = useParams();
    const today = new Date();
    const eventDate = event ? new Date(event.date) : null;
    const { user, isLoading } = useUser()

    const daysLeft = useMemo(() => {
        if (!eventDate) return null;
        return Math.ceil(
            (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
    }, [eventDate]);
    console.log(daysLeft)
    const isClosed = daysLeft !== null && daysLeft <= 0;

    useEffect(() => {
        // 1. Wait for Context to be ready
        if (isLoading || !user) return;

        const fetchEvent = async () => {
            try {
                const res = await fetch(`/api/events/${eventId}`);
                const data = await res.json();

                // 2. Simplify the registration check
                const isUserRegistered = data?.registrations?.some(
                    (item: any) => item.userId === user?.user.id
                );

                setIsRegistered(!!isUserRegistered);
                setEvent(data);
                setLoading(false);
            } catch (error) {
                console.error("Fetch failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId, user, isLoading]); // Re-runs when context is ready


    // if(user?.registrations.find((item) => item.eventId === eventId)){
    //     setCanRegister(false)
    // }

    if (loading) return <PageSkeleton />;
    if (!event) return <EmptyState />;

    const handleRegister = async () => {
        if (user?.universityDetails === undefined || user?.universityDetails === null) {
            setCanRegister(false);
        } else {

            const response = await fetch(`/api/events/${event.id}/register`, { method: "POST", body: JSON.stringify(user?.universityDetails) });
            if (!response.ok) {
                alert("Registration failed. Please try again.");
            }
            else
                setIsRegistered(true);
        }
    };

    const handleShare = async () => {
        const shareUrl = window.location.href;

        if (navigator.share) {
            // NATIVE MOBILE SHARE
            try {
                await navigator.share({
                    title: "Check out this event!",
                    url: shareUrl,
                });
            } catch (err) {
                console.log("User cancelled or share failed", err);
            }
        } else {
            // DESKTOP FALLBACK (Your current code)
            await navigator.clipboard.writeText(shareUrl);
            alert("Event link copied to clipboard! 🎉");
        }
    };


    // Mock data for demo - replace with real API data
    const stats = {
        attendees: 247,
        capacity: 500,
        rating: 4.8,
        reviews: 156,
    };

    const rewards = [
        { icon: "🏆", title: "Certificate", desc: "Attendance certificate" },
        { icon: "🎁", title: "Swag Bag", desc: "Event merchandise" },
        { icon: "🤝", title: "Network", desc: "Connect with 500+ people" },
    ];

    const highlights = [
        "Interactive workshops and hands-on sessions",
        "Network with industry leaders and experts",
        "Complimentary refreshments and lunch",
        "Q&A session with keynote speakers",
    ];

    const reviews = [
        {
            name: "Sarah Johnson",
            avatar: "SJ",
            rating: 5,
            comment: "Amazing event! Learned so much and made great connections.",
            date: "2 weeks ago",
        },
        {
            name: "Michael Chen",
            avatar: "MC",
            rating: 5,
            comment: "Well organized and incredibly insightful. Highly recommend!",
            date: "1 month ago",
        },
        {
            name: "Emily Davis",
            avatar: "ED",
            rating: 4,
            comment: "Great speakers and content. Venue was a bit crowded though.",
            date: "1 month ago",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br w-full space-y-4 from-pink-50 via-white to-purple-50 lg:mx-2">

            {/* Dialog for users who have not added their university details  */}
            {!canRegister && (
                <div className="fixed inset-0  backdrop-blur-sm   flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border max-w-md mx-4">
                        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Complete Your Profile</h2>
                        <p className="text-sm sm:text-base mb-4 sm:mb-6">Please add your university details to register for events.</p>
                        <button
                            onClick={() => { window.location.href = '/profile' }}
                            className="w-full py-2.5 sm:py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white text-sm sm:text-base font-medium rounded-lg transition-colors"
                        >
                            Complete Profile
                        </button>
                    </div>
                </div>
            )}

            {/* HERO SECTION */}
            <section className="relative overflow-hidden">
                {/* Background Pattern */}
                {/* <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-95" /> */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                        backgroundSize: "40px 40px",
                    }}
                />

                {event.imageUrl && (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-95"
                    />
                )}

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-12 sm:py-16 md:py-32 md:pt-20">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-medium border border-white/30">
                            {event.category}
                        </span>
                        {!isClosed && (
                            <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-yellow-400 text-yellow-900 text-xs sm:text-sm font-bold flex items-center gap-1">
                                <span className="animate-pulse ">⚡</span> Registration Open
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-1 sm:mb-4 md:mb-4 leading-tight">
                        {event.title}
                    </h1>

                    <p className="text-sm sm:text-lg md:text-xl text-pink-100 max-w-3xl mb-2 sm:mb-8 leading-relaxed">
                        {event.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-white/90 text-xs sm:text-base">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <span className="font-medium">
                                {eventDate!.toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span className="font-medium">
                                {eventDate!.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            <span className="font-medium">{event.location}</span>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="relative -mb-1 ">
                    <svg
                        className="w-full h-8 sm:h-12 md:h-20 absolute bottom-0 rotate-180"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                            fill="#ffffff"
                        />
                    </svg>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="max-w-6xl lg:mx-auto lg:px-6 -mt-8 sm:-mt-12 relative z-10">
                <div className="bg-white rounded-2xl lg:shadow-xl  lg:border rounded-b-none lg:rounded-b-2xl md:border-gray-100 p-4 sm:p-6 md:p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                {stats.attendees}
                            </div>
                            <div className="text-gray-600 text-xs sm:text-sm md:text-base mt-1 sm:mt-2">Registered</div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-2 sm:mt-3">
                                <div
                                    className="bg-gradient-to-r from-pink-600 to-purple-600 h-1.5 sm:h-2 rounded-full"
                                    style={{
                                        width: `${(stats.attendees / stats.capacity) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                                {stats.capacity}
                            </div>
                            <div className="text-gray-600 text-xs sm:text-sm md:text-base mt-1 sm:mt-2">Total Capacity</div>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center gap-0.5 sm:gap-1 text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-500">
                                {stats.rating}
                                <span className="text-lg sm:text-xl md:text-2xl">★</span>
                            </div>
                            <div className="text-gray-600 text-xs sm:text-sm md:text-base mt-1 sm:mt-2">Average Rating</div>
                        </div>

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

            {/* Registration for mobile view only */}
            <div className="bg-white lg:hidden shadow-md border-gray-100 p-4 sm:p-6 lg:p-8 pt-0">
                {!isClosed && daysLeft !== null && daysLeft <= 7 && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-xl">
                        <div className="flex items-center gap-2 text-orange-700 text-xs sm:text-sm font-semibold">
                            <span className="text-base sm:text-xl">⏰</span>
                            <span>
                                {daysLeft <= 2
                                    ? "Last chance to register!"
                                    : `Only ${daysLeft} days left!`}
                            </span>
                        </div>
                    </div>
                )}

                <div className="flex items-center relative space-x-2 transition">
                    {isClosed ? (
                        <button
                            disabled
                            className="w-full py-3 sm:py-4 text-xs sm:text-sm rounded-xl bg-gray-100 text-gray-400 font-semibold"
                        >
                            Registration Closed
                        </button>
                    ) : isRegistered ? (
                        <div className="w-full">
                            <button
                                disabled
                                className="w-full py-3 sm:py-4 px-3 sm:px-4 rounded-xl bg-green-50 border-2 border-green-500 text-green-700 font-semibold text-base sm:text-lg flex items-center justify-center gap-2"
                            >
                                <span className="text-xs sm:text-sm">✓</span>
                                <p className="text-xs sm:text-sm"> Registered!</p>
                            </button>
                            <p className="text-xs sm:text-sm text-center text-green-600 mt-2 sm:mt-3">
                                Check your email for confirmation
                            </p>
                        </div>
                    ) : (
                        <button
                            onClick={handleRegister}
                            className="w-full py-3 sm:py-4 text-xs sm:text-sm rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        >
                            Register Now
                        </button>
                    )}

                    <button
                        onClick={handleShare}
                        className="w-full py-3 sm:py-4 text-xs sm:text-sm rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                        </svg>
                        <span className="hidden sm:inline">Share</span>
                    </button>
                </div>

                {!isClosed && (
                    <div className="mt-4 sm:mt-6 pt-3 sm:pt-5">
                        <p className="text-xs sm:text-sm text-gray-600 text-center">
                            {stats.capacity - stats.attendees} spots remaining
                        </p>
                    </div>
                )}
            </div>

            {/* MAIN CONTENT */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-16 grid lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                {/* LEFT CONTENT */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8 md:space-y-12">
                    {/* Event Highlights */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                            <span className="text-2xl sm:text-3xl">✨</span>
                            Event Highlights
                        </h2>
                        <ul className="space-y-3 sm:space-y-4">
                            {highlights.map((highlight, i) => (
                                <li key={i} className="flex items-start gap-2 sm:gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white flex items-center justify-center text-xs sm:text-sm font-bold">
                                        ✓
                                    </span>
                                    <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                        {highlight}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Rewards */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl border border-purple-100 p-4 sm:p-6 md:p-8">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                            <span className="text-2xl sm:text-3xl">🎁</span>
                            What You'll Get
                        </h2>
                        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
                            {rewards.map((reward, i) => (
                                <div
                                    key={i}
                                    className="bg-white space-x-3 md:space-x-0 items-center flex md:block rounded-xl p-4 sm:p-6 md:text-center shadow-md hover:shadow-xl transition-shadow"
                                >
                                    <div className="text-3xl sm:text-4xl md:mb-3">{reward.icon}</div>
                                    <div>
                                        <h3 className="text-sm sm:text-base font-bold text-gray-900 md:mb-2">
                                            {reward.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-600">{reward.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="text-2xl sm:text-3xl">⭐</span>
                                <span className="hidden sm:inline">Attendee Reviews</span>
                                <span className="sm:hidden">Reviews</span>
                            </h2>
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-yellow-500 text-base sm:text-lg md:text-xl font-bold">
                                    {stats.rating} ★
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500">
                                    {stats.reviews} reviews
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            {reviews.map((review, i) => (
                                <div
                                    key={i}
                                    className="border-b border-gray-100 pb-4 sm:pb-6 last:border-0 last:pb-0"
                                >
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-white flex items-center justify-center text-sm sm:text-base font-bold">
                                            {review.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                                                <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                                                    {review.name}
                                                </h4>
                                                <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0 ml-2">
                                                    {review.date}
                                                </span>
                                            </div>
                                            <div className="flex gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={`text-sm sm:text-base ${i < review.rating
                                                                ? "text-yellow-500"
                                                                : "text-gray-300"
                                                            }`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-xs sm:text-sm md:text-base text-gray-700">{review.comment}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="space-y-6 hidden md:block">
                    <div className="sticky top-6 space-y-6">
                        {/* Registration Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
                            {!isClosed && daysLeft !== null && daysLeft <= 7 && (
                                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                                    <div className="flex items-center gap-2 text-orange-700 font-semibold">
                                        <span className="text-xl">⏰</span>
                                        <span className="text-sm md:text-base">
                                            {daysLeft <= 2
                                                ? "Last chance to register!"
                                                : `Only ${daysLeft} days left!`}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {isClosed ? (
                                <button
                                    disabled
                                    className="w-full py-3 md:py-4 rounded-xl bg-gray-100 text-gray-400 font-semibold text-base md:text-lg"
                                >
                                    Registration Closed
                                </button>
                            ) : isRegistered ? (
                                <div>
                                    <button
                                        disabled
                                        className="w-full py-3 md:py-4 rounded-xl bg-green-50 border-2 border-green-500 text-green-700 font-semibold text-base md:text-lg flex items-center justify-center gap-2"
                                    >
                                        <span className="text-lg md:text-xl">✓</span>
                                        You're Registered!
                                    </button>
                                    <p className="text-xs md:text-sm text-center text-gray-600 mt-3">
                                        Check your email for confirmation
                                    </p>
                                </div>
                            ) : (
                                <button
                                    onClick={handleRegister}
                                    className="w-full py-3 md:py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                                >
                                    Register Now
                                </button>
                            )}

                            <button
                                onClick={handleShare}
                                className="w-full mt-4 py-2.5 md:py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                            >
                                <svg
                                    className="w-4 h-4 md:w-5 md:h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                    />
                                </svg>
                                Share Event
                            </button>

                            {!isClosed && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-xs md:text-sm text-gray-600 text-center">
                                        {stats.capacity - stats.attendees} spots remaining
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
                                    <span className="font-semibold text-gray-900">
                                        {event.category}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Duration</span>
                                    <span className="font-semibold text-gray-900">Full Day</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Language</span>
                                    <span className="font-semibold text-gray-900">English</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Price</span>
                                    <span className="font-semibold text-green-600">FREE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ---------------- Skeleton & Empty ---------------- */

function PageSkeleton() {
    return (
        <div className="min-h-screen  w-full space-y-4 bg-gradient-to-br from-pink-50 via-white to-purple-50">
            {/* Hero Skeleton */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-95" />
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-20 lg:py-32 animate-pulse">
                    <div className="h-6 sm:h-8 w-24 sm:w-32 bg-white/20 rounded-full mb-3 sm:mb-4 md:mb-6" />
                    <div className="h-10 sm:h-12 md:h-16 lg:h-20 bg-white/20 rounded-lg mb-3 sm:mb-4 md:mb-6 w-full max-w-2xl" />
                    <div className="h-5 sm:h-6 md:h-8 bg-white/20 rounded-lg mb-2 sm:mb-3 w-full max-w-xl" />
                    <div className="h-5 sm:h-6 md:h-8 bg-white/20 rounded-lg mb-4 sm:mb-6 md:mb-8 w-full max-w-md" />
                    <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6">
                        <div className="h-5 sm:h-6 w-32 sm:w-40 md:w-48 bg-white/20 rounded" />
                        <div className="h-5 sm:h-6 w-28 sm:w-32 md:w-40 bg-white/20 rounded" />
                        <div className="h-5 sm:h-6 w-30 sm:w-36 md:w-44 bg-white/20 rounded" />
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                    <svg
                        className="relative block w-full h-8 sm:h-12 lg:h-20 rotate-180"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                            fill="#fdf2f8"
                        />
                    </svg>
                </div>
            </div>

            {/* Stats Skeleton */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 md:-mt-12 relative z-10 mb-6 sm:mb-12 md:mb-16">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-100 p-4 sm:p-6 md:p-8 animate-pulse">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="text-center">
                                <div className="h-6 sm:h-8 md:h-10 w-12 sm:w-16 md:w-20 bg-gray-200 rounded mx-auto mb-2" />
                                <div className="h-3 sm:h-3 md:h-4 w-10 sm:w-12 md:w-16 bg-gray-200 rounded mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12 grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-12 animate-pulse">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <div className="h-40 sm:h-48 md:h-64 bg-white rounded-xl sm:rounded-2xl shadow-lg" />
                    <div className="h-40 sm:h-48 md:h-64 bg-white rounded-xl sm:rounded-2xl shadow-lg" />
                    <div className="h-40 sm:h-48 md:h-64 bg-white rounded-xl sm:rounded-2xl shadow-lg" />
                </div>
                <div className="h-48 sm:h-64 md:h-96 bg-white rounded-xl sm:rounded-2xl shadow-xl" />
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">😕</div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Event Not Found
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                    The event you're looking for doesn't exist or has been removed.
                </p>
            </div>
        </div>
    );
}