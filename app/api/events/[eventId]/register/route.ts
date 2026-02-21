import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from 'zod'

const registrationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    enrollmentNumber: z.string()
        .length(10, 'Enrollment number must be exactly 10 digits')
        .regex(/^\d+$/, 'Enrollment number must contain only digits'),
    phoneNumber: z.string()
        .length(10, 'Phone number must be exactly 10 digits')
        .regex(/^\d+$/, 'Phone number must contain only digits'),
    course: z.string().min(1, 'Course is required'),
    year: z.number().min(1).max(4),
    group: z.string().min(1, 'Group is required'),
})

export async function POST(
    request: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { eventId } = await params;

        if (!eventId) {
            return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
        }

        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Verify event exists
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        })

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 })
        }

        const body = await request.json()
        const validatedData = registrationSchema.parse(body)
        
        // Check if user already registered
        const existingRegistration = await prisma.registration.findUnique({
            where: {
                userId_eventId: {
                    userId: user.id,
                    eventId: eventId
                }
            }
        })

        if (existingRegistration) {
            return NextResponse.json(
                { error: "You are already registered for this event" },
                { status: 409 }
            )
        }

        const registration = await prisma.registration.create({
            data: {
                userId: user.id,
                eventId: eventId,
                name: validatedData.name,
                enrollmentNumber: validatedData.enrollmentNumber,
                phoneNumber: validatedData.phoneNumber,
                course: validatedData.course,
                year: validatedData.year,
                group: validatedData.group
            }
        })

        return NextResponse.json({
            message: "Registration successful",
            registration
        }, { status: 201 })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error.issues },
                { status: 400 }
            )
        }
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: "Registration failed" },
            { status: 500 }
        )
    }
}