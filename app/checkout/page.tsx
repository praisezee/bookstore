"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCart, getCartTotal, clearCart } from "@/lib/cart";
import type { CartItem } from "@/lib/types";
import { toast } from "sonner";

export default function CheckoutPage() {
	const router = useRouter();
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		customer_name: "",
		customer_email: "",
		customer_phone: "",
		shipping_address: "",
	});

	const config = {
		public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
		tx_ref: Date.now().toString(),
		amount: total,
		currency: "NGN",
		payment_options: "card,account,ussd,banktransfer,nqr,opay",
		customer: {
			email: formData.customer_email,
			phone_number: formData.customer_phone,
			name: formData.customer_name,
		},
		customizations: {
			title: "BookStore & Bakery",
			description: "Payment for your order",
			logo: "/placeholder-logo.png",
		},
	};

	const handleFlutterPayment = useFlutterwave(config);

	useEffect(() => {
		const items = getCart();
		if (items.length === 0) {
			router.push("/cart");
			return;
		}
		setCartItems(items);
		setTotal(getCartTotal());
	}, [router]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Create order first
			const orderResponse = await fetch("/api/orders", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					items: cartItems,
					total_amount: total,
				}),
			});

			if (!orderResponse.ok) {
				throw new Error("Failed to create order");
			}

			const order = await orderResponse.json();

			// Update config with order ID
			config.tx_ref = order.id;

			handleFlutterPayment({
				callback: async (response) => {
					console.log(response);
					closePaymentModal();

					if (response.status === "completed") {
						// Update order payment status
						await fetch(`/api/orders/${order.id}/payment`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								payment_reference: response.transaction_id,
								payment_status: "completed",
							}),
						});

						clearCart();
						toast.success("Payment successful! Check your email for confirmation.");
						router.push(`/order-confirmation/${order.id}`);
					} else {
						toast.error("Payment failed. Please try again.");
					}
				},
				onClose: () => {
					toast.info("Payment cancelled");
				},
			});
		} catch (error) {
			console.error("Checkout error:", error);
			toast.error("Failed to process order. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<h1 className="text-3xl font-bold mb-8">Checkout</h1>

			<div className="grid md:grid-cols-2 gap-8">
				{/* Checkout Form */}
				<Card>
					<CardHeader>
						<CardTitle>Shipping Information</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleSubmit}
							className="space-y-4">
							<div>
								<Label htmlFor="customer_name">Full Name</Label>
								<Input
									id="customer_name"
									name="customer_name"
									value={formData.customer_name}
									onChange={handleInputChange}
									required
								/>
							</div>

							<div>
								<Label htmlFor="customer_email">Email</Label>
								<Input
									id="customer_email"
									name="customer_email"
									type="email"
									value={formData.customer_email}
									onChange={handleInputChange}
									required
								/>
							</div>

							<div>
								<Label htmlFor="customer_phone">Phone Number</Label>
								<Input
									id="customer_phone"
									name="customer_phone"
									type="tel"
									value={formData.customer_phone}
									onChange={handleInputChange}
									required
								/>
							</div>

							<div>
								<Label htmlFor="shipping_address">Shipping Address</Label>
								<Textarea
									id="shipping_address"
									name="shipping_address"
									value={formData.shipping_address}
									onChange={handleInputChange}
									rows={3}
									required
								/>
							</div>

							<Button
								type="submit"
								className="w-full"
								size="lg"
								disabled={loading}>
								{loading ? "Processing..." : `Pay ₦${total.toFixed(2)}`}
							</Button>
						</form>
					</CardContent>
				</Card>

				{/* Order Summary */}
				<Card>
					<CardHeader>
						<CardTitle>Order Summary</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{cartItems.map((item) => (
							<div
								key={item.id}
								className="flex justify-between">
								<span>
									{item.name} x {item.quantity}
								</span>
								<span>₦{(item.price * item.quantity).toFixed(2)}</span>
							</div>
						))}
						<div className="border-t pt-4">
							<div className="flex justify-between font-bold text-lg">
								<span>Total</span>
								<span>₦{total.toFixed(2)}</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
