import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminFromToken } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = await getAdminFromToken(token)
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()

    const order = await prisma.orders.update({
      where: { id: params.id },
      data: { status },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Update order status error:", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}
