import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // -------------------
  // USERS (Clerk-linked)
  // -------------------

  const user1 = await prisma.user.create({
    data: {
      clerkUserId: "clerk_user_1",
      name: "Aarav Sharma",
      email: "aarav@example.com",
      avatarUrl: "https://avatar.vercel.sh/aarav",
      ecoScore: 120,
      trustScore: 4.8,
      ecoImpact: {
        create: {
          itemsReused: 5,
          carbonSavedKg: 18.5,
          wasteReducedKg: 7.2,
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      clerkUserId: "clerk_user_2",
      name: "Neha Verma",
      email: "neha@example.com",
      avatarUrl: "https://avatar.vercel.sh/neha",
      ecoScore: 90,
      trustScore: 4.6,
      ecoImpact: {
        create: {
          itemsReused: 3,
          carbonSavedKg: 12.1,
          wasteReducedKg: 4.8,
        },
      },
    },
  });

  // -------------------
  // ITEMS
  // -------------------

  const drill = await prisma.item.create({
    data: {
      title: "Electric Drill Machine",
      description: "Rarely used electric drill, perfect for home repairs.",
      category: "Tools",
      condition: "GOOD",
      mode: "RENT",
      price: 100,
      rentUnit: "day",
      deposit: 500,
      location: "Delhi",
      ownerId: user1.id,
      sustainabilityScore: 25,
      images: {
        create: [
          {
            blobUrl: "https://vercel.blob/drill-1.jpg",
            fileName: "drill.jpg",
            mimeType: "image/jpeg",
            size: 245678,
          },
        ],
      },
    },
  });

  const books = await prisma.item.create({
    data: {
      title: "Engineering Mathematics Books",
      description: "Complete 1st year engineering math books set.",
      category: "Books",
      condition: "USED",
      mode: "SELL",
      price: 600,
      location: "Noida",
      ownerId: user2.id,
      sustainabilityScore: 15,
      images: {
        create: [
          {
            blobUrl: "https://vercel.blob/books-1.jpg",
            fileName: "books.jpg",
            mimeType: "image/jpeg",
            size: 198234,
          },
        ],
      },
    },
  });

  // -------------------
  // RENTAL
  // -------------------

  const rental = await prisma.rental.create({
    data: {
      itemId: drill.id,
      renterId: user2.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      totalAmount: 300,
      status: "RETURNED",
    },
  });

  // -------------------
  // TRANSACTION
  // -------------------

  await prisma.transaction.create({
    data: {
      userId: user2.id,
      rentalId: rental.id,
      amount: 300,
      paymentMethod: "UPI",
      status: "SUCCESS",
    },
  });

  // -------------------
  // REVIEWS
  // -------------------

  await prisma.review.createMany({
    data: [
      {
        rating: 5,
        comment: "Item was in great condition and easy pickup.",
        itemId: drill.id,
        reviewerId: user2.id,
        receiverId: user1.id,
      },
      {
        rating: 5,
        comment: "Smooth renter, returned item on time!",
        itemId: drill.id,
        reviewerId: user1.id,
        receiverId: user2.id,
      },
    ],
  });

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
