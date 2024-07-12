import { PrismaClient } from '@prisma/client';
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log("eventType", eventType);

  switch (eventType) {
    case "user.created":
      try {
        await prisma.user.create({
          data: {
            email: payload?.data?.email_addresses?.[0]?.email_address || "",
            first_name: payload?.data?.first_name || "",
            last_name: payload?.data?.last_name || "",
            image_url: payload?.data?.profile_image_url,
            clerkId: payload?.data?.id,
          },
        });

        return NextResponse.json({
          status: 200,
          message: "User info inserted",
        });
      } catch (error: any) {
        console.log("error", error);
        return NextResponse.json({
          status: 400,
          message: error.message,
        });
      }

    case "user.updated":
      try {
        await prisma.user.update({
          where: {
            clerkId: payload?.data?.id,
          },
          data: {
            email: payload?.data?.email_addresses?.[0]?.email_address,
            first_name: payload?.data?.first_name,
            last_name: payload?.data?.last_name,
            image_url: payload?.data?.profile_image_url,
          },
        });

        return NextResponse.json({
          status: 200,
          message: "User info updated",
        });
      } catch (error: any) {
        return NextResponse.json({
          status: 400,
          message: error.message,
        });
      }

    default:
      return new Response("Error occurred -- unhandled event type", {
        status: 400,
      });
  }
}
