import { currentUser } from '@clerk/nextjs/server';

import  prisma  from './prisma';

export const checkUser = async () => {
    const user = await currentUser();
    if (!user) {
        return null;
    }

    const loggedInUser = await prisma.user.findUnique({
        where: {
            clerkId: user.id,
        },
    });

    if (loggedInUser) {
        return loggedInUser;
    }

    const newUser = await prisma.user.create({
        data: {
            clerkId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            first_name:user.firstName || '',
            last_name:user.lastName || '',
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0]?.emailAddress,
        },
    });

    return newUser;
};