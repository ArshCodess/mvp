import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
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

    try {
        const registrations = await prisma.registration.findMany({
            where: { userId: user.id },
            include: {
                event: {
                    select: {
                        title: true,
                        date: true,
                        id: true,
                        imageUrl: true,
                    }
                },
            },
        })
        return NextResponse.json(registrations, { status: 200 })

    } catch (err) {
        console.error("Error fetching registrations:", err)
        return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
    }
}