import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const linkSchema = z.object({
    id:    z.string().optional(),
    label: z.string().min(1, "Link label is required"),
    url:   z.string().min(1, "URL is required"),        // simple string, no URL validation
    type:  z.enum(["WHATSAPP", "MEET", "ZOOM", "DISCORD", "YOUTUBE", "OTHER"]).default("OTHER"),
});

const highlightSchema = z.object({
    id:   z.string().optional(),
    text: z.string().min(1, "Highlight text is required"),
});

const rewardSchema = z.object({
    id:          z.string().optional(),
    icon:        z.string().min(1),
    title:       z.string().min(1, "Reward title is required"),
    description: z.string().min(1, "Reward description is required"),
});

const updateEventSchema = z.object({
    title:       z.string().min(1, "Title is required").max(200),
    description: z.string().min(1, "Description is required"),
    date:        z.string().datetime("Invalid date format"),
    location:    z.string().min(1, "Location is required"),
    category:    z.string().min(1, "Category is required"),
    imageUrl:    z.string().nullable().optional(),
    capacity:    z.number().int().min(0).default(0),
    highlights:  z.array(highlightSchema).default([]),
    rewards:     z.array(rewardSchema).default([]),
    links:       z.array(linkSchema).default([]),
});

// ─── GET /api/events/[eventId] ────────────────────────────────────────────────

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { userId } = await auth();
        const { eventId } = await params;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                createdBy: true,
                registrations: {
                    include: { user: true },
                },
                announcements: {
                    include: { createdBy: true },
                    orderBy: { createdAt: "desc" },
                },
                links:      { orderBy: { type: "asc" } },
                highlights: true,
                rewards:    true,
                _count: {
                    select: {
                        registrations: true,
                        announcements: true,
                    },
                },
            },
        });

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        return NextResponse.json(
            { error: "Failed to fetch event" },
            { status: 500 }
        );
    }
}

// ─── PATCH /api/events/[eventId] ──────────────────────────────────────────────

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { userId } = await auth();
        const { eventId } = await params;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user || user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Only admins can update events" },
                { status: 403 }
            );
        }

        const existing = await prisma.event.findUnique({
            where: { id: eventId },
            select: { id: true },
        });

        if (!existing) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const body = await request.json();
        const v = updateEventSchema.parse(body);

        // 1. Update core event fields
        await prisma.event.update({
            where: { id: eventId },
            data: {
                title:       v.title,
                description: v.description,
                date:        new Date(v.date),
                location:    v.location,
                category:    v.category,
                imageUrl:    v.imageUrl ?? null,
                capacity:    v.capacity,
            },
        });

        // ── HIGHLIGHTS ────────────────────────────────────────────────────────

        // Delete all existing highlights for this event and recreate from scratch
        await prisma.eventHighlight.deleteMany({ where: { eventId } });

        if (v.highlights.length > 0) {
            await prisma.eventHighlight.createMany({
                data: v.highlights.map(h => ({ text: h.text, eventId })),
            });
        }

        // ── REWARDS ───────────────────────────────────────────────────────────

        await prisma.eventReward.deleteMany({ where: { eventId } });

        if (v.rewards.length > 0) {
            await prisma.eventReward.createMany({
                data: v.rewards.map(r => ({
                    icon:        r.icon,
                    title:       r.title,
                    description: r.description,
                    eventId,
                })),
            });
        }

        // ── LINKS ─────────────────────────────────────────────────────────────

        await prisma.eventLink.deleteMany({ where: { eventId } });

        if (v.links.length > 0) {
            await prisma.eventLink.createMany({
                data: v.links.map(l => ({
                    label:   l.label,
                    url:     l.url,
                    type:    l.type,
                    eventId,
                })),
            });
        }

        // Return the fully-populated updated event
        const updatedEvent = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                createdBy:  true,
                highlights: true,
                rewards:    true,
                links:      { orderBy: { type: "asc" } },
                _count: {
                    select: {
                        registrations: true,
                        announcements: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedEvent);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Error updating event:", error);
        return NextResponse.json(
            { error: "Failed to update event" },
            { status: 500 }
        );
    }
}

// ─── DELETE /api/events/[eventId] ─────────────────────────────────────────────

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { userId } = await auth();
        const { eventId } = await params;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user || user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Only admins can delete events" },
                { status: 403 }
            );
        }

        // onDelete: Cascade handles highlights, rewards, links,
        // registrations, and announcements automatically
        await prisma.event.delete({ where: { id: eventId } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting event:", error);
        return NextResponse.json(
            { error: "Failed to delete event" },
            { status: 500 }
        );
    }
}