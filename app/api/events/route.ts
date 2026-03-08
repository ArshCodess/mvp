import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const linkSchema = z.object({
    label: z.string().min(1, "Link label is required"),
    url:   z.string().url("Must be a valid URL"),
    type:  z.enum(["WHATSAPP", "MEET", "ZOOM", "DISCORD", "YOUTUBE", "OTHER"]).default("OTHER"),
});

const highlightSchema = z.object({
    text: z.string().min(1, "Highlight text is required"),
});

const rewardSchema = z.object({
    icon:        z.string().min(1),
    title:       z.string().min(1, "Reward title is required"),
    description: z.string().min(1, "Reward description is required"),
});

const eventSchema = z.object({
    title:       z.string().min(1, "Title is required").max(200),
    description: z.string().min(1, "Description is required"),
    date:        z.string().datetime("Invalid date format"),
    location:    z.string().min(1, "Location is required"),
    category:    z.string().min(1, "Category is required"),
    imageUrl:    z.string().url("Must be a valid URL").nullable().optional(),
    capacity:    z.number().int().min(0).default(0), // 0 = unlimited
    highlights:  z.array(highlightSchema).default([]),
    rewards:     z.array(rewardSchema).default([]),
    links:       z.array(linkSchema).default([]),
});

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

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        let events

        if (myEvents && user.role === 'ADMIN') {
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
            if (search.length > 0) {
                events = await prisma.event.findMany({
                    where: {
                        title: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                })
            } else {
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

// ─── POST /api/events ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user || user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Only admins can create events" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const validatedData = eventSchema.parse(body);

        // ── Create event + nested relations in one transaction ──────────────
        const event = await prisma.event.create({
            data: {
                title:       validatedData.title,
                description: validatedData.description,
                date:        new Date(validatedData.date),
                location:    validatedData.location,
                category:    validatedData.category,
                imageUrl:    validatedData.imageUrl ?? null,
                capacity:    validatedData.capacity,
                createdById: user.id,

                // Nested creates — Prisma handles them in the same transaction
                highlights: validatedData.highlights.length > 0
                    ? {
                          create: validatedData.highlights.map(h => ({
                              text: h.text,
                          })),
                      }
                    : undefined,

                rewards: validatedData.rewards.length > 0
                    ? {
                          create: validatedData.rewards.map(r => ({
                              icon:        r.icon,
                              title:       r.title,
                              description: r.description,
                          })),
                      }
                    : undefined,

                links: validatedData.links.length > 0
                    ? {
                          create: validatedData.links.map(l => ({
                              label: l.label,
                              url:   l.url,
                              type:  l.type,
                          })),
                      }
                    : undefined,
            },
            include: {
                createdBy:  true,
                highlights: true,
                rewards:    true,
                links:      true,
                _count: {
                    select: {
                        registrations: true,
                        announcements: true,
                    },
                },
            },
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Error creating event:", error);
        return NextResponse.json(
            { error: "Failed to create event" },
            { status: 500 }
        );
    }
}