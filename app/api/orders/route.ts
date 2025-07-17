import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { CartItem } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_name, customer_email, customer_phone, shipping_address, items, total_amount } = body

    // Create order
    const order = await prisma.orders.create({
      data: {
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        total_amount,
        status: "pending",
        payment_status: "pending",
      },
    })

    // Create order items
    for (const item of items as CartItem[]) {
      await prisma.order_items.create({
        data: {
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        },
      })

      // Update product stock
      await prisma.products.update({
        where: { id: item.id },
        data: {
          stock_quantity: {
            decrement: item.quantity,
          },
        },
      })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
