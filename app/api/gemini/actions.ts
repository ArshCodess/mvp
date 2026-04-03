// "use server"
// import prisma from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";
// import z from "zod";

// const linkSchema = z.object({
//     label: z.string().min(1, "Link label is required"),
//     url: z.string().url("Must be a valid URL"),
//     type: z.enum(["WHATSAPP", "MEET", "ZOOM", "DISCORD", "YOUTUBE", "OTHER"]).default("OTHER"),
// });

// const highlightSchema = z.object({
//     text: z.string().min(1, "Highlight text is required"),
// });

// const rewardSchema = z.object({
//     icon: z.string().min(1),
//     title: z.string().min(1, "Reward title is required"),
//     description: z.string().min(1, "Reward description is required"),
// });
// const eventSchema = z.object({
//     title: z.string().min(1, "Title is required").max(200),
//     description: z.string().min(1, "Description is required"),
//     date: z.string().datetime("Invalid date format"),
//     location: z.string().min(1, "Location is required"),
//     category: z.string().min(1, "Category is required"),
//     imageUrl: z.string().url("Must be a valid URL").nullable().optional(),
//     capacity: z.number().int().min(0).default(0), // 0 = unlimited
//     highlights: z.array(highlightSchema).default([]),
//     rewards: z.array(rewardSchema).default([]),
//     links: z.array(linkSchema).default([]),
// });
// export async function createEvent(request: {
//     title: string,
//     description: string,
//     category: string,
//     date: string,
//     capacity: number,
//     location: string,
//     imageUrl: string,
//     highlights: string[],
//     rewards: string[],
//     links: string[],
// }) {
//     try {
//         const { userId } = await auth();

//         if (!userId) {
//             console.error("Unauthorized: No user ID found in auth context");
//             throw new Error("Unauthorized");
//         }

//         const user = await prisma.user.findUnique({
//             where: { clerkId: userId },
//         });

//         if (!user || user.role !== "ADMIN") {
//             console.error("User not found or not an admin:", user);
//             throw new Error("Only admins can create events");
//         }

//         const validatedData = eventSchema.parse(request);

//         // ── Create event + nested relations in one transaction ──────────────
//         const event = await prisma.event.create({
//             data: {
//                 title: validatedData.title,
//                 description: validatedData.description,
//                 date: new Date(validatedData.date),
//                 location: validatedData.location,
//                 category: validatedData.category,
//                 imageUrl: validatedData.imageUrl ?? null,
//                 capacity: validatedData.capacity,
//                 createdById: user.id,

//                 // Nested creates — Prisma handles them in the same transaction
//                 highlights: validatedData.highlights.length > 0
//                     ? {
//                         create: validatedData.highlights.map(h => ({
//                             text: h.text,
//                         })),
//                     }
//                     : undefined,

//                 rewards: validatedData.rewards.length > 0
//                     ? {
//                         create: validatedData.rewards.map(r => ({
//                             icon: r.icon,
//                             title: r.title,
//                             description: r.description,
//                         })),
//                     }
//                     : undefined,

//                 links: validatedData.links.length > 0
//                     ? {
//                         create: validatedData.links.map(l => ({
//                             label: l.label,
//                             url: l.url,
//                             type: l.type,
//                         })),
//                     }
//                     : undefined,
//             },
//             include: {
//                 createdBy: true,
//                 highlights: true,
//                 rewards: true,
//                 links: true,
//                 _count: {
//                     select: {
//                         registrations: true,
//                         announcements: true,
//                     },
//                 },
//             },
//         });

//         console.log("Event created successfully:", event);
//     } catch (error) {
//         if (error instanceof z.ZodError) {
//             console.error("Validation error:", error);
//         }
//         console.error("Error creating event:", error);
//     }
// }

// // await createEvent({
// //   "title": "Music Concert",
// //   "description": "Join us for an unforgettable night of music and entertainment at Central Park! Enjoy live performances by top bands and artists, delicious food, and a vibrant atmosphere. Don't miss out on this incredible music concert!",
// //   "category": "Music",
// //   "date": "2024-12-25T19:00:00.000Z",
// //   "capacity": 500,
// //   "location": "Central Park",
// //   "imageUrl": "https://example.com/concert.jpg",
// //   "highlights": [
// //     "live performances",
// //     "food stalls",
// //     "vibrant atmosphere"
// //   ],
// //   "rewards": [
// //     "exclusive merchandise",
// //     "discounts on future events"
// //   ],
// //   "links": [
// //     "https://example.com/concert",
// //     "https://example.com/contact"
// //   ]
// // })