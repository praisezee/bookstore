import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.orders.findUnique({
      where: { id: params.id },
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Get order error:", error)
    return NextResponse.json({ error: "Failed to get order" }, { status: 500 })
  }
}
