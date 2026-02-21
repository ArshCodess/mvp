import { NextRequest, NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'

const eventSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
    }).optional(),
    location: z.string().min(1).optional(),
})

// GET /api/events/[id] - Get single event
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { userId } = await auth()
        const {eventId} = await params;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const event = await prisma.event.findUnique({
            where: {
                 id: eventId },
            include: {
                createdBy: true,
                registrations: {
                    include: {
                        user: true,
                    },
                },
                announcements: {
                    include: {
                        createdBy: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                _count: {
                    select: {
                        registrations: true,
                        announcements: true,
                    },
                },
            },
        })

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 })
        }

        return NextResponse.json(event)
    } catch (error) {
        console.error('Error fetching event:', error)
        return NextResponse.json(
            { error: 'Failed to fetch event' },
            { status: 500 }
        )
    }
}

// PUT /api/events/[id] - Update event (Admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
                { error: 'Only admins can update events' },
                { status: 403 }
            )
        }

        const event = await prisma.event.findUnique({
            where: { id: params.id },
        })

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 })
        }

        if (event.createdById !== user.id) {
            return NextResponse.json(
                { error: 'You can only update your own events' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const validatedData = eventSchema.parse(body)

        const updatedEvent = await prisma.event.update({
            where: { id: params.id },
            data: {
                ...(validatedData.title && { title: validatedData.title }),
                ...(validatedData.description && { description: validatedData.description }),
                ...(validatedData.date && { date: new Date(validatedData.date) }),
                ...(validatedData.location && { location: validatedData.location }),
            },
            include: {
                createdBy: true,
                _count: {
                    select: {
                        registrations: true,
                        announcements: true,
                    },
                },
            },
        })

        return NextResponse.json(updatedEvent)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.issues },
                { status: 400 }
            )
        }
        console.error('Error updating event:', error)
        return NextResponse.json(
            { error: 'Failed to update event' },
            { status: 500 }
        )
    }
}

// DELETE /api/events/[id] - Delete event (Admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } =await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: userId },
        })

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Only admins can delete events' },
                { status: 403 }
            )
        }

        const event = await prisma.event.findUnique({
            where: { id: params.id },
        })

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 })
        }

        if (event.createdById !== user.id) {
            return NextResponse.json(
                { error: 'You can only delete your own events' },
                { status: 403 }
            )
        }

        await prisma.event.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Event deleted successfully' })
    } catch (error) {
        console.error('Error deleting event:', error)
        return NextResponse.json(
            { error: 'Failed to delete event' },
            { status: 500 }
        )
    }
}