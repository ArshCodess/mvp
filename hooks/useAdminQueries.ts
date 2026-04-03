import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
type Stats = {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalUsers: number;
  totalRegistrations: number;
  recentRegistrations: number;
  userGrowth: number;
  eventGrowth: number;
  registrationGrowth: number;
};

type DashboardData = {
  stats: Stats;
  topEvents: any[];
  recentUsers: any[];
  eventsByCategory: any[];
  registrationTrend: any[];
};

type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  category: string;
  imageUrl?: string;
  _count: {
    registrations: number;
    announcements: number;
  };
  createdBy: {
    name: string;
    email: string;
  };
};

type EventsResponse = {
  events: Event[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type UsersResponse = {
  users: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type CreateEventData = {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  imageUrl?: string;
};

// Query Keys
export const queryKeys = {
  dashboard: ["admin", "dashboard"] as const,
  events: (params?: Record<string, string>) =>["admin", "events", params] as const,
  users: (params?: Record<string, string>) =>["admin", "users", params] as const,
  eventDetail: (id: string) => ["admin", "event", id] as const,
  userDetail: (id: string) => ["admin", "user", id] as const,
};

// ============================================
// DASHBOARD STATS HOOK
// ============================================
export function useDashboardStats() {
  return useQuery<DashboardData>({
    queryKey: queryKeys.dashboard,
    queryFn: async () => {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - stats change less frequently
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
  });
}

// ============================================
// EVENTS HOOKS
// ============================================
export function useEvents(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.search) searchParams.append("search", params.search);
  if (params?.category) searchParams.append("category", params.category);
  if (params?.status) searchParams.append("status", params.status);

  const queryParams = Object.fromEntries(searchParams);

  return useQuery<EventsResponse>({
    queryKey: queryKeys.events(queryParams),
    queryFn: async () => {
      const response = await fetch(`/api/admin/events?${searchParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      return response.json();
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEventData) => {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create event");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch events list
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateEventData>;
    }) => {
      const response = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update event");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate specific event
      queryClient.invalidateQueries({
        queryKey: queryKeys.eventDetail(variables.id),
      });
      // Invalidate events list
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete event");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate events list
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

// ============================================
// USERS HOOKS
// ============================================
export function useUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.search) searchParams.append("search", params.search);
  if (params?.role) searchParams.append("role", params.role);

  const queryParams = Object.fromEntries(searchParams);

  return useQuery<UsersResponse>({
    queryKey: queryKeys.users(queryParams),
    queryFn: async () => {
      const response = await fetch(`/api/admin/users?${searchParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// ============================================
// PREFETCH HOOKS (for hover/tab switching)
// ============================================
export function usePrefetchEvents() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.events(),
      queryFn: async () => {
        const response = await fetch("/api/admin/events");
        if (!response.ok) throw new Error("Failed to prefetch events");
        return response.json();
      },
    });
  };
}

export function usePrefetchUsers() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.users(),
      queryFn: async () => {
        const response = await fetch("/api/admin/users");
        if (!response.ok) throw new Error("Failed to prefetch users");
        return response.json();
      },
    });
  };
}

// ============================================
// OPTIMISTIC UPDATES EXAMPLE
// ============================================
export function useOptimisticEventUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateEventData>;
    }) => {
      const response = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      return response.json();
    },
    // Optimistically update the cache before the mutation completes
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["admin", "events"] });

      // Snapshot the previous value
      const previousEvents = queryClient.getQueryData(["admin", "events"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["admin", "events"], (old: any) => {
        if (!old?.events) return old;
        return {
          ...old,
          events: old.events.map((event: Event) =>
            event.id === id ? { ...event, ...data } : event
          ),
        };
      });

      // Return context with the snapshot
      return { previousEvents };
    },
    // If mutation fails, rollback
    onError: (err, variables, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(["admin", "events"], context.previousEvents);
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
    },
  });
}