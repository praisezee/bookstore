import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const body = await request.json();
		const { payment_reference, payment_status } = body;

		const order = await prisma.orders.update({
			where: { id: params.id },
			data: {
				payment_reference: payment_reference.toString(),
				payment_status,
				status: payment_status === "completed" ? "confirmed" : "pending",
			},
		});

		// Get order with items for email
		const orderWithItems = await prisma.orders.findUnique({
			where: { id: params.id },
			include: {
				order_items: {
					include: {
						products: true,
					},
				},
			},
		});

		if (orderWithItems && payment_status === "completed") {
			// Add order confirmation URL to the order object
			const orderWithConfirmationUrl = {
				...orderWithItems,
				confirmation_url: `${
					process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
				}/order-confirmation/${params.id}`,
			};
			await sendOrderConfirmationEmail(orderWithConfirmationUrl);
		}

		return NextResponse.json(order);
	} catch (error) {
		console.error("Payment update error:", error);
		return NextResponse.json(
			{ error: "Failed to update payment" },
			{ status: 500 }
		);
	}
}
