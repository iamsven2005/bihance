import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { imageurl, time, location, eventId } = await request.json();
  const { userId: authUserId } = auth();

  const userId = authUserId || "sampleuser";

  try {
    const newAttendance = await prisma.attendance.create({
      data: {
        userId,
        imageurl,
        time,
        location,
        eventId
      },
    });

    return NextResponse.json(newAttendance, { status: 200 });
  } catch (error) {
    console.error('Failed to save attendance:', error);
    return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 });
  }
}
