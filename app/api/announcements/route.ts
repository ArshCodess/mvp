import { NextRequest, NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'

const announcementSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  heading: z.string().min(1, 'Heading is required'),
  description: z.string().min(1, 'Description is required'),
})

// GET /api/announcements - Get announcements (optionally filtered by event)
export async function GET(request: NextRequest) {
  try {
    const { userId } =await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }


    const announcements = await prisma.announcement.findMany({
      include:{
        event: true,
        createdBy: true,
      }
    });

    return NextResponse.json(announcements)
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}

// POST /api/announcements - Create announcement (Admin only)
export async function POST(request: NextRequest) {
  try {
    const { userId } =await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can create announcements' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = announcementSchema.parse(body)

    // Check if event exists and admin owns it
    const event = await prisma.event.findUnique({
      where: { id: validatedData.eventId },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (event.createdById !== user.id) {
      return NextResponse.json(
        { error: 'You can only create announcements for your own events' },
        { status: 403 }
      )
    }

    const announcement = await prisma.announcement.create({
      data: {
        heading: validatedData.heading,
        description: validatedData.description,
        eventId: validatedData.eventId,
        createdById: user.id,
      },
      include: {
        event: true,
        createdBy: true,
      },
    })

    return NextResponse.json(announcement, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Error creating announcement:', error)
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    )
  }
}