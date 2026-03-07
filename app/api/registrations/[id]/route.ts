import { NextRequest, NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'

const registrationSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  course: z.string().min(1, 'Course is required'),
  enrollmentNumber: z.string().min(1, 'Enrollment number is required'),
  group: z.string().min(1, 'Group is required'),
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  year : z.number().int().min(1, 'Year is required').max(4, 'Year must be less than or equal to 4').default(1),

})

// GET /api/registrations - Get user's registrations
export async function GET(request: NextRequest) {
  try {
    const { userId } =await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const registrations = await prisma.registration.findMany({
      where: { userId: user.id },
      include: {
        event: {
          include: {
            createdBy: true,
          },
        },
      },
      orderBy: { registeredAt: 'desc' },
    })

    return NextResponse.json(registrations)
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}

// POST /api/registrations - Register for an event
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = registrationSchema.parse(body)

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: validatedData.eventId },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if already registered
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: validatedData.eventId,
        },
      },
    })

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Already registered for this event' },
        { status: 400 }
      )
    }

    const registration = await prisma.registration.create({
      data: {
        userId: user.id,
        eventId: validatedData.eventId,
        course: validatedData.course,
        enrollmentNumber: validatedData.enrollmentNumber,
        group: validatedData.group,
        name: validatedData.name,
        phoneNumber: validatedData.phoneNumber,
        year: validatedData.year,
      },
      include: {
        event: {
          include: {
            createdBy: true,
          },
        },
      },
    })

    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Error creating registration:', error)
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    )
  }
}