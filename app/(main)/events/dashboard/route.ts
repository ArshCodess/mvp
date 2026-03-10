import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'
import  prisma  from '@/lib/prisma'
const eventSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
    }),
    category: z.string().min(1, 'Category is required'),
    location: z.string().min(1, 'Location is required'),
})

// GET /api/events - Get all events
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const myEvents = searchParams.get('myEvents') === 'true'

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get or create user
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        let events

        if (myEvents && user.role === 'ADMIN') {
            // Admin: Get events created by them
            events = await prisma.event.findMany({
                where: { createdById: user.id },
                include: {
                    createdBy: true,
                    _count: {
                        select: {
                            registrations: true,
                            announcements: true,
                        },
                    },
                },
                orderBy: { date: 'desc' },
            })
        } else {
            if (search.length>0){
                events =await prisma.event.findMany({
                    where:{
                        title:{
                            contains: search,
                            mode:'insensitive'
                        }
                    }
                })
            }else{
                // Get all events
            events = await prisma.event.findMany({
                include: {
                    createdBy: true,
                    registrations: {
                        where: { userId: user.id },
                    },
                    _count: {
                        select: {
                            registrations: true,
                            announcements: true,
                        },
                    },
                },
                orderBy: { date: 'desc' },
            })
            }
        }

        return NextResponse.json(events)
    } catch (error) {
        console.error('Error fetching events:', error)
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        )
    }
}

// POST /api/events - Create a new event (Admin only)
export async function POST(request: NextRequest) {
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
                { error: 'Only admins can create events' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const validatedData = eventSchema.parse(body)

        const event = await prisma.event.create({
            data: {
                title: validatedData.title,
                description: validatedData.description,
                date: new Date(validatedData.date),
                location: validatedData.location,
                category: validatedData.category,
                createdById: user.id,
                imageUrl:user.imageUrl|| "",
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

        return NextResponse.json(event, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.issues },
                { status: 400 }
            )
        }
        console.error('Error creating event:', error)
        return NextResponse.json(
            { error: 'Failed to create event' },
            { status: 500 }
        )
    }
}