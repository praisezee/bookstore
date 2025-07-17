"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
	id: string;
	quantity: number;
	price: number;
	products: {
		id: string;
		name: string;
		image_url: string;
	};
}

interface Order {
	id: string;
	customer_name: string;
	customer_email: string;
	customer_phone: string;
	shipping_address: string;
	total_amount: number;
	status: string;
	payment_status: string;
	payment_reference: string;
	created_at: string;
	order_items: OrderItem[];
}

export default function OrderDetailsPage({
	params,
}: {
	params: { id: string };
}) {
	const router = useRouter();
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(false);

	useEffect(() => {
		fetchOrder();
	}, []);

	const fetchOrder = async () => {
		try {
			const token = localStorage.getItem("adminToken");
			const response = await fetch(`/api/admin/orders/${params.id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setOrder(data);
			} else {
				toast.error("Failed to load order");
			}
		} catch (error) {
			console.error("Failed to fetch order:", error);
			toast.error("Failed to load order");
		} finally {
			setLoading(false);
		}
	};

	const updateOrderStatus = async (newStatus: string) => {
		setUpdating(true);
		try {
			const token = localStorage.getItem("adminToken");
			const response = await fetch(`/api/admin/orders/${params.id}/status`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ status: newStatus }),
			});

			if (response.ok) {
				setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
				toast.success("Order status updated successfully!");
			} else {
				toast.error("Failed to update order status");
			}
		} catch (error) {
			console.error("Update status error:", error);
			toast.error("Failed to update order status");
		} finally {
			setUpdating(false);
		}
	};

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

	if (loading) {
		return <div className="p-6">Loading...</div>;
	}

	if (!order) {
		return <div className="p-6">Order not found</div>;
	}

	return (
		<div className="p-6">
			<div className="flex items-center gap-4 mb-6">
				<Button
					variant="ghost"
					size="sm"
					asChild>
					<Link href="/admin/orders">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Orders
					</Link>
				</Button>
				<h1 className="text-3xl font-bold">Order Details</h1>
			</div>

			<div className="grid lg:grid-cols-3 gap-6">
				{/* Order Information */}
				<div className="lg:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								Order #{order.id.slice(0, 8)}
								<div className="flex gap-2">
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
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid md:grid-cols-2 gap-4">
								<div>
									<h4 className="font-semibold mb-2">Customer Information</h4>
									<div className="space-y-1 text-sm">
										<p>
											<strong>Name:</strong> {order.customer_name}
										</p>
										<p>
											<strong>Email:</strong> {order.customer_email}
										</p>
										<p>
											<strong>Phone:</strong> {order.customer_phone}
										</p>
									</div>
								</div>
								<div>
									<h4 className="font-semibold mb-2">Order Information</h4>
									<div className="space-y-1 text-sm">
										<p>
											<strong>Date:</strong>{" "}
											{new Date(order.created_at).toLocaleDateString()}
										</p>
										<p>
											<strong>Total:</strong> ₦{Number(order.total_amount).toFixed(2)}
										</p>
										{order.payment_reference && (
											<p>
												<strong>Payment Ref:</strong> {order.payment_reference}
											</p>
										)}
									</div>
								</div>
							</div>

							<div>
								<h4 className="font-semibold mb-2">Shipping Address</h4>
								<p className="text-sm">{order.shipping_address}</p>
							</div>
						</CardContent>
					</Card>

					{/* Order Items */}
					<Card>
						<CardHeader>
							<CardTitle>Order Items</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{order.order_items.map((item) => (
									<div
										key={item.id}
										className="flex items-center gap-4 p-4 border rounded-lg">
										<Image
											src={item.products.image_url || "/placeholder.svg"}
											alt={item.products.name}
											width={60}
											height={60}
											className="rounded-lg object-cover"
										/>
										<div className="flex-1">
											<h4 className="font-semibold">{item.products.name}</h4>
											<p className="text-sm text-muted-foreground">
												Quantity: {item.quantity} × ₦{Number(item.price).toFixed(2)}
											</p>
										</div>
										<div className="text-right">
											<p className="font-bold">
												₦{(item.quantity * Number(item.price)).toFixed(2)}
											</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Order Actions */}
				<div>
					<Card>
						<CardHeader>
							<CardTitle>Order Actions</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<label className="text-sm font-medium mb-2 block">Update Status</label>
								<Select
									onValueChange={updateOrderStatus}
									value={order.status}
									disabled={updating}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="pending">Pending</SelectItem>
										<SelectItem value="confirmed">Confirmed</SelectItem>
										<SelectItem value="shipped">Shipped</SelectItem>
										<SelectItem value="completed">Completed</SelectItem>
										<SelectItem value="cancelled">Cancelled</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="pt-4 border-t">
								<div className="text-sm space-y-2">
									<div className="flex justify-between">
										<span>Subtotal:</span>
										<span>₦{Number(order.total_amount).toFixed(2)}</span>
									</div>
									<div className="flex justify-between font-bold">
										<span>Total:</span>
										<span>₦{Number(order.total_amount).toFixed(2)}</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
