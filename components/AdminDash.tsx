"use client";

import { useState } from "react";
import {
    Calendar,
    Users,
    TrendingUp,
    Award,
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    ArrowUp,
    ArrowDown,
    Loader2,
    Download,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";
import {
    useDashboardStats,
    useEvents,
    useUsers,
    useDeleteEvent,
    usePrefetchEvents,
    usePrefetchUsers,
} from "@/hooks/useAdminQueries";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"overview" | "events" | "users">("overview");
    const queryClient = useQueryClient();

    // Prefetch hooks for smooth tab switching
    const prefetchEvents = usePrefetchEvents();
    const prefetchUsers = usePrefetchUsers();

    // Prefetch on hover for instant tab switching
    const handleTabHover = (tab: "events" | "users") => {
        if (tab === "events") {
            prefetchEvents();
        } else if (tab === "users") {
            prefetchUsers();
        }
    };

    const handleRefreshAll = () => {
        queryClient.invalidateQueries();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-xs sm:text-sm text-gray-600">Manage your campus events</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRefreshAll}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Refresh all data"
                            >
                                <RefreshCw className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Tabs with prefetch on hover */}
                    <div className="flex gap-1 -mb-px overflow-x-auto">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === "overview"
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("events")}
                            onMouseEnter={() => handleTabHover("events")}
                            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === "events"
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Events Management
                        </button>
                        <button
                            onClick={() => setActiveTab("users")}
                            onMouseEnter={() => handleTabHover("users")}
                            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === "users"
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Users Management
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === "overview" && <OverviewTab />}
                {activeTab === "events" && <EventsManagementTab />}
                {activeTab === "users" && <UsersManagementTab />}
            </div>
        </div>
    );
}

// Overview Tab Component
function OverviewTab() {
    const { data, isLoading, error, refetch, isFetching } = useDashboardStats();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load dashboard</h3>
                <p className="text-gray-600 mb-6">{error.message}</p>
                <button
                    onClick={() => refetch()}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const { stats, topEvents, recentUsers } = data!;

    return (
        <div className="space-y-8">
            {/* Refetching indicator */}
            {isFetching && (
                <div className="fixed top-20 right-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Updating...</span>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Events"
                    value={stats.totalEvents}
                    change={stats.eventGrowth}
                    icon={Calendar}
                    color="indigo"
                />
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    change={stats.userGrowth}
                    icon={Users}
                    color="pink"
                />
                <StatCard
                    title="Registrations"
                    value={stats.totalRegistrations}
                    change={stats.registrationGrowth}
                    icon={TrendingUp}
                    color="purple"
                />
                <StatCard
                    title="Upcoming Events"
                    value={stats.upcomingEvents}
                    change={0}
                    icon={Award}
                    color="green"
                />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Events */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        Top Events
                    </h3>
                    <div className="space-y-4">
                        {topEvents.map((event, index) => (
                            <div key={event.id} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-pink-100 flex items-center justify-center text-sm font-bold text-indigo-700">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{event.title}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(event.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-sm font-semibold text-indigo-600">
                                    {event.registrations} regs
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-pink-600" />
                        Recent Users
                    </h3>
                    <div className="space-y-4">
                        {recentUsers.map((user) => (
                            <div key={user.id} className="flex items-center gap-3">
                                {user.imageUrl ? (
                                    <img
                                        src={user.imageUrl}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                                        {user.name?.charAt(0) || "U"}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                                <div className="text-xs text-gray-500">{user.registrations} events</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickActionCard
                    title="Create Event"
                    description="Add a new campus event"
                    icon={Plus}
                    color="indigo"
                    href="/events/create"
                />
                <QuickActionCard
                    title="View Reports"
                    description="Analytics and insights"
                    icon={TrendingUp}
                    color="pink"
                    href="/reports"
                />
                <QuickActionCard
                    title="Manage Users"
                    description="User roles and access"
                    icon={Users}
                    color="purple"
                    href="/admin/users"
                />
                <QuickActionCard
                    title="Announcements"
                    description="Send notifications"
                    icon={Calendar}
                    color="green"
                    href="/announcements"
                />
            </div>
        </div>
    );
}

// Events Management Tab
function EventsManagementTab() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);

    const { data, isLoading, error, refetch, isFetching } = useEvents({
        page,
        limit: 10,
        search: search || undefined,
        status: filter !== "all" ? filter : undefined,
    });

    const deleteEventMutation = useDeleteEvent();

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this event?")) {
            try {
                await deleteEventMutation.mutateAsync(id);
                // Success feedback is automatic via toast or you can add custom notification
            } catch (error) {
                alert("Failed to delete event");
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Refetching indicator */}
            {isFetching && (
                <div className="fixed top-20 right-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Updating...</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
                    <p className="text-sm text-gray-600 mt-1">Create and manage campus events</p>
                </div>
                <Link href="/events/create">
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                        <Plus className="w-4 h-4" />
                        Create Event
                    </button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Events</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                    </select>
                </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
                        <p className="text-gray-600">Loading events...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <p className="text-gray-600 mb-4">Failed to load events</p>
                        <button
                            onClick={() => refetch()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Retry
                        </button>
                    </div>
                ) : data?.events.length === 0 ? (
                    <div className="p-12 text-center">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">No events found</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Event
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Registrations
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data?.events.map((event) => (
                                        <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {event.imageUrl ? (
                                                        <img
                                                            src={event.imageUrl}
                                                            alt={event.title}
                                                            className="w-10 h-10 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-pink-100 flex items-center justify-center">
                                                            <Calendar className="w-5 h-5 text-indigo-600" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                                                        <p className="text-xs text-gray-500">{event.location}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(event.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                                                    {event.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                {event._count.registrations}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/events/${event.id}`}>
                                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                            <Eye className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                    </Link>
                                                    <Link href={`/events/${event.id}/update`}>
                                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                            <Edit className="w-4 h-4 text-indigo-600" />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(event.id)}
                                                        disabled={deleteEventMutation.isPending}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        {deleteEventMutation.isPending ? (
                                                            <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {data && data.pagination.totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Page {data.pagination.page} of {data.pagination.totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage((p) => p + 1)}
                                        disabled={page >= data.pagination.totalPages}
                                        className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// Users Management Tab
function UsersManagementTab() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const { data, isLoading, error, refetch, isFetching } = useUsers({
        page,
        limit: 12,
        search: search || undefined,
    });

    return (
        <div className="space-y-6">
            {/* Refetching indicator */}
            {isFetching && (
                <div className="fixed top-20 right-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Updating...</span>
                </div>
            )}

            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
                <p className="text-sm text-gray-600 mt-1">Manage user accounts and roles</p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Users Grid */}
            {isLoading ? (
                <div className="text-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
                    <p className="text-gray-600">Loading users...</p>
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <p className="text-gray-600 mb-4">Failed to load users</p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data?.users.map((user) => (
                            <div
                                key={user.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    {user.imageUrl ? (
                                        <img
                                            src={user.imageUrl}
                                            alt={user.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                                            {user.name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === "ADMIN"
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {user.role}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{user.name}</h3>
                                <p className="text-sm text-gray-600 mb-4 truncate">{user.email}</p>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div>
                                        <div className="text-lg font-bold text-indigo-600">
                                            {user._count.registrations}
                                        </div>
                                        <div className="text-xs text-gray-500">Events</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-pink-600">
                                            {user._count.eventsCreated}
                                        </div>
                                        <div className="text-xs text-gray-500">Created</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-purple-600">
                                            {user._count.announcements}
                                        </div>
                                        <div className="text-xs text-gray-500">Posts</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {data && data.pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4">
                            <p className="text-sm text-gray-600">
                                Page {data.pagination.page} of {data.pagination.totalPages}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={page >= data.pagination.totalPages}
                                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// Stat Card Component (same as before)
function StatCard({
    title,
    value,
    change,
    icon: Icon,
    color,
}: {
    title: string;
    value: number;
    change: number;
    icon: any;
    color: string;
}) {
    const colorClasses = {
        indigo: "from-indigo-500 to-indigo-600",
        pink: "from-pink-500 to-pink-600",
        purple: "from-purple-500 to-purple-600",
        green: "from-green-500 to-green-600",
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]
                        } flex items-center justify-center`}
                >
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {change !== 0 && (
                    <div
                        className={`flex items-center gap-1 text-sm font-semibold ${change > 0 ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {change > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-sm text-gray-600">{title}</div>
        </div>
    );
}

// Quick Action Card Component (same as before)
function QuickActionCard({
    title,
    description,
    icon: Icon,
    color,
    href,
}: {
    title: string;
    description: string;
    icon: any;
    color: string;
    href: string;
}) {
    const colorClasses = {
        indigo: "from-indigo-500 to-indigo-600",
        pink: "from-pink-500 to-pink-600",
        purple: "from-purple-500 to-purple-600",
        green: "from-green-500 to-green-600",
    };

    return (
        <Link href={href}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer group">
                <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]
                        } flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </Link>
    );
}