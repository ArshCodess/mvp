import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { auth, currentUser } from '@clerk/nextjs/server'

const userSchema = z.object({
    role: z.enum(['PARTICIPANT', 'ADMIN']).optional(),
})

// GET /api/users/me - Get current user
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Find 
        let user = await prisma.user.findUnique({
            where: { clerkId: userId },
            include:{
                universityDetails:true
            }
        })

        if (!user) {
            return NextResponse.json({error:'User not found'},{status:404})
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        )
    }
}

// PUT /api/users/me - Update current user
export async function PUT(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const clerkUser = await currentUser()

        if (!clerkUser || !clerkUser.emailAddresses[0]) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const email = clerkUser.emailAddresses[0].emailAddress

        const body = await request.json()
        const validatedData = userSchema.parse(body)

        const user = await prisma.user.update({
            where: { email },
            data: {
                ...(validatedData.role && { role: validatedData.role }),
            },
        })

        return NextResponse.json(user)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.issues },
                { status: 400 }
            )
        }
        console.error('Error updating user:', error)
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        )
    }
}