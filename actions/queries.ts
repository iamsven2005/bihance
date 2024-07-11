import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { cache } from 'react';

const prisma = new PrismaClient();
const DAY_IN_MS = 86_400_400;

export const getUserSubscription = cache(async () => {
    const { userId } = await auth();
    if (!userId) return null;

    const data = await prisma.userSubcription.findFirst({
        where: { user_id: userId },
    });

    if (!data) return null;

    const isActive = data.stripePriceId && new Date(data.stripeEnd).getTime() + DAY_IN_MS > Date.now();

    return {
        ...data,
        isActive: !!isActive,
    };
});
