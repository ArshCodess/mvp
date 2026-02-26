import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

// GET /api/admin/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Admin only.' },
        { status: 403 }
      )
    }

    // Get current date for time-based queries
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Fetch all statistics in parallel
    const [
      totalEvents,
      upcomingEvents,
      pastEvents,
      totalUsers,
      totalRegistrations,
      recentRegistrations,
      eventsByCategory,
      registrationTrend,
      topEvents,
      recentUsers,
    ] = await Promise.all([
      // Total events
      prisma.event.count(),

      // Upcoming events
      prisma.event.count({
        where: { date: { gte: now } },
      }),

      // Past events
      prisma.event.count({
        where: { date: { lt: now } },
      }),

      // Total users
      prisma.user.count(),

      // Total registrations
      prisma.registration.count(),

      // Recent registrations (last 30 days)
      prisma.registration.count({
        where: {
          registeredAt: { gte: thirtyDaysAgo },
        },
      }),

      // Events by category
      prisma.event.groupBy({
        by: ['category'],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      }),

      // Registration trend (last 7 days)
      prisma.registration.groupBy({
        by: ['registeredAt'],
        where: {
          registeredAt: {
            gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        _count: {
          id: true,
        },
      }),

      // Top events by registrations
      prisma.event.findMany({
        take: 5,
        include: {
          _count: {
            select: { registrations: true },
          },
        },
        orderBy: {
          registrations: {
            _count: 'desc',
          },
        },
      }),

      // Recent users
      prisma.user.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: {
            select: { registrations: true },
          },
        },
      }),
    ])

    // Calculate growth percentages (mock for now, you can enhance this)
    const userGrowth = 12.5
    const eventGrowth = 8.3
    const registrationGrowth = 24.7

    return NextResponse.json({
      stats: {
        totalEvents,
        upcomingEvents,
        pastEvents,
        totalUsers,
        totalRegistrations,
        recentRegistrations,
        userGrowth,
        eventGrowth,
        registrationGrowth,
      },
      eventsByCategory: eventsByCategory.map((cat) => ({
        category: cat.category,
        count: cat._count.id,
      })),
      registrationTrend: registrationTrend.map((day) => ({
        date: day.registeredAt,
        count: day._count.id,
      })),
      topEvents: topEvents.map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date,
        registrations: event._count.registrations,
      })),
      recentUsers: recentUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
        registrations: user._count.registrations,
      })),
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}