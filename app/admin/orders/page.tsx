import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
	async function getOrders() {
		return prisma.orders.findMany({
			include: {
				order_items: {
					include: {
						products: true,
					},
				},
			},
			orderBy: {
				created_at: "desc",
			},
		});
	}

	function getStatusColor(status: string) {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "confirmed":
				return "bg-blue-100 text-blue-800";
			case "shipped":
				return "bg-purple-100 text-purple-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			default:
				return "bg-yellow-100 text-yellow-800";
		}
	}
	const orders = await getOrders();

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Orders</h1>
				<div className="text-sm text-muted-foreground">
					Total: {orders.length} orders
				</div>
			</div>

			<div className="space-y-4">
				{orders.map((order) => (
					<Card key={order.id}>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<div className="flex items-center gap-4">
										<h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
										<Badge className={getStatusColor(order.status)}>{order.status}</Badge>
										<Badge
											variant="outline"
											className={
												order.payment_status === "completed"
													? "border-green-500 text-green-700"
													: "border-yellow-500 text-yellow-700"
											}>
											Payment: {order.payment_status}
										</Badge>
									</div>

									<div className="text-sm text-muted-foreground space-y-1">
										<p>
											<strong>Customer:</strong> {order.customer_name}
										</p>
										<p>
											<strong>Email:</strong> {order.customer_email}
										</p>
										<p>
											<strong>Phone:</strong> {order.customer_phone}
										</p>
										<p>
											<strong>Items:</strong> {order.order_items.length} item(s)
										</p>
										<p>
											<strong>Date:</strong>{" "}
											{new Date(order.created_at).toLocaleDateString()}
										</p>
									</div>
								</div>

								<div className="text-right space-y-2">
									<div className="text-2xl font-bold text-emerald-600">
										₦{Number(order.total_amount).toFixed(2)}
									</div>
									<Button
										size="sm"
										asChild>
										<Link href={`/admin/orders/${order.id}`}>
											<Eye className="h-4 w-4 mr-2" />
											View Details
										</Link>
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{orders.length === 0 && (
				<div className="text-center py-12">
					<p className="text-muted-foreground">No orders found.</p>
				</div>
			)}
		</div>
	);
}
