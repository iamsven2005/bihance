import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, email_addresses, first_name, image_url, last_name } = body?.data

    const email = email_addresses[0]?.email_address
    console.log('✅', body)

    await db.user.upsert({
      where: { user_id: id },
      update: {
        email,
        first_name,
        last_name,
        profile_image_url: image_url,
      },
      create: {
        user_id: id,
        email,
        first_name,
        last_name,
        profile_image_url: image_url || '',
      },
    })
    return new NextResponse('User updated in database successfully', {
      status: 200,
    })
  } catch (error) {
    console.error('Error updating database:', error)
    return new NextResponse('Error updating user in database', { status: 500 })
  }
}