import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""

  const boards = await db.board.findMany({
    where: q
      ? {
          OR: [
            { one: { contains: q, mode: "insensitive" } },
            { two: { contains: q, mode: "insensitive" } },
            { three: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined, // no filter: return all
    orderBy: { id: "desc" }, // optional: show newest first
  })

  return NextResponse.json(boards)
}
