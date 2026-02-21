import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'

const universityDetailsSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    enrollmentNumber: z.string()
        .length(10, 'Enrollment number must be exactly 10 digits')
        .regex(/^\d+$/, 'Enrollment number must contain only digits'),
    course: z.string().min(1, 'Course is required'),
    year: z.number().min(1, 'Year is required').max(4, 'Year must be between 1 and 4'),
    group: z.string().min(1, 'Group is required'),
    phoneNumber: z.string()
        .length(10, 'Phone number must be exactly 10 digits')
        .regex(/^\d+$/, 'Phone number must contain only digits'),
})

// GET /api/profile - Get user profile with university details
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            include: {
                universityDetails: true,
                registrations:{
                    select:{
                        eventId: true,
                    }
                },
                _count: {
                    select: {
                        eventsCreated: true,
                        registrations: true,
                        announcements: true,
                    },
                },
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            user: {
                id: user.id,
                clerkId: user.clerkId,
                email: user.email,
                name: user.name,
                firstName: user.first_name,
                lastName: user.last_name,
                imageUrl: user.imageUrl,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            universityDetails: user.universityDetails,
            registrations: user.registrations,
            stats: {
                eventsCreated: user._count.eventsCreated,
                eventsRegistered: user._count.registrations,
                announcements: user._count.announcements,
            },
        })
    } catch (error) {
        console.error('Error fetching profile:', error)
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        )
    }
}

// PUT /api/profile - Update user profile and university details
export async function PUT(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const body = await request.json()
        const validatedData = universityDetailsSchema.parse(body)

        // Check if enrollment number is already taken by another user
        const existingEnrollment = await prisma.universityDetails.findUnique({
            where: { enrollmentNumber: validatedData.enrollmentNumber },
        })

        if (existingEnrollment && existingEnrollment.userId !== user.id) {
            return NextResponse.json(
                { error: 'This enrollment number is already registered' },
                { status: 409 }
            )
        }

        // Upsert university details
        const universityDetails = await prisma.universityDetails.upsert({
            where: { userId: user.id },
            update: {
                name: validatedData.name,
                enrollmentNumber: validatedData.enrollmentNumber,
                course: validatedData.course,
                year: validatedData.year,
                group: validatedData.group,
                phoneNumber: validatedData.phoneNumber,
            },
            create: {
                userId: user.id,
                name: validatedData.name,
                enrollmentNumber: validatedData.enrollmentNumber,
                course: validatedData.course,
                year: validatedData.year,
                group: validatedData.group,
                phoneNumber: validatedData.phoneNumber,
            },
        })

        return NextResponse.json({
            message: 'Profile updated successfully',
            universityDetails,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.issues },
                { status: 400 }
            )
        }
        console.error('Error updating profile:', error)
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        )
    }
}

// PATCH /api/profile - Update only specific fields
export async function PATCH(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const body = await request.json()

        // Partial validation - only validate fields that are present
        const updateData: any = {}

        if (body.name !== undefined) {
            updateData.name = body.name
        }
        if (body.enrollmentNumber !== undefined) {
            if (!/^\d{10}$/.test(body.enrollmentNumber)) {
                return NextResponse.json(
                    { error: 'Invalid enrollment number' },
                    { status: 400 }
                )
            }
            updateData.enrollmentNumber = body.enrollmentNumber
        }
        if (body.course !== undefined) {
            updateData.course = body.course
        }
        if (body.year !== undefined) {
            updateData.year = Number(body.year)
        }
        if (body.group !== undefined) {
            updateData.group = body.group
        }
        if (body.phoneNumber !== undefined) {
            if (!/^\d{10}$/.test(body.phoneNumber)) {
                return NextResponse.json(
                    { error: 'Invalid phone number' },
                    { status: 400 }
                )
            }
            updateData.phoneNumber = body.phoneNumber
        }

        const universityDetails = await prisma.universityDetails.update({
            where: { userId: user.id },
            data: updateData,
        })

        return NextResponse.json({
            message: 'Profile updated successfully',
            universityDetails,
        })
    } catch (error) {
        console.error('Error updating profile:', error)
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        )
    }
}