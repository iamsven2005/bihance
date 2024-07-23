// app/api/blog/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

interface BlogPost {
  title: string;
  description: string;
}

export async function POST(req: Request) {
    const { userId } = auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
  
  try {
    const body: BlogPost = await req.json();

    const result = await prisma.blog.create({
      data: {
        title: body.title,
        description: body.description,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
