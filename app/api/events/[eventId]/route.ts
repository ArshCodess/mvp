import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

const updateSchema = z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }).optional(),
    category: z.string().min(1, 'Category is required').optional(),
    location: z.string().min(1, 'Location is required').optional(),
    imageUrl: z.string().url('Invalid image URL').optional().nullable(),
})
// GET /api/events/[id] - Get single event
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { userId } = await auth()
        const { eventId } = await params;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const event = await prisma.event.findUnique({
            where: {
                id: eventId
            },
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

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { userId } = await auth()
        const { eventId } = await params;
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { clerkId: userId } })

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Only admins can update events' }, { status: 403 })
        }

        // Make sure the event exists and belongs to this admin
        const existing = await prisma.event.findUnique({
            where: { id: eventId },
        })

        if (!existing) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 })
        }

        if (existing.createdById !== user.id) {
            return NextResponse.json({ error: 'You can only edit your own events' }, { status: 403 })
        }

        const body = await request.json()
        const validatedData = updateSchema.parse(body)

        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: {
                ...(validatedData.title && { title: validatedData.title }),
                ...(validatedData.description && { description: validatedData.description }),
                ...(validatedData.date && { date: new Date(validatedData.date) }),
                ...(validatedData.category && { category: validatedData.category }),
                ...(validatedData.location && { location: validatedData.location }),
                ...('imageUrl' in validatedData && { imageUrl: validatedData.imageUrl ?? null }),
            },
            include: {
                createdBy: true,
                _count: {
                    select: { registrations: true, announcements: true },
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
        return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
    }
}

// DELETE /api/events/[eventId] — Admin only, must own the event
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { userId } = await auth()
        const { eventId } = await params;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { clerkId: userId } })

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Only admins can delete events' }, { status: 403 })
        }

        const existing = await prisma.event.findUnique({
            where: { id: eventId },
        })

        if (!existing) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 })
        }

        if (existing.createdById !== user.id) {
            return NextResponse.json({ error: 'You can only delete your own events' }, { status: 403 })
        }

        await prisma.event.delete({ where: { id: eventId } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting event:', error)
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
    }
}
