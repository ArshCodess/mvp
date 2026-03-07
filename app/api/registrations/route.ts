import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

const registrationSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
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
