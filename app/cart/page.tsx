"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
	getCart,
	updateCartQuantity,
	removeFromCart,
	getCartTotal,
} from "@/lib/cart";
import type { CartItem } from "@/lib/types";

export default function CartPage() {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		const updateCart = () => {
			setCartItems(getCart());
			setTotal(getCartTotal());
		};

		updateCart();
		window.addEventListener("cartUpdated", updateCart);

		return () => window.removeEventListener("cartUpdated", updateCart);
	}, []);

	const handleQuantityChange = (productId: string, newQuantity: number) => {
		updateCartQuantity(productId, newQuantity);
	};

	const handleRemoveItem = (productId: string) => {
		removeFromCart(productId);
	};

	if (cartItems.length === 0) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="text-center py-12">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">
						Your Cart is Empty
					</h1>
					<p className="text-gray-600 mb-8">Add some products to get started!</p>
					<Button asChild>
						<Link href="/products">Continue Shopping</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<h1 className="text-3xl font-bold text-gray-900 mb-8 dark:text-gray-100">
				Shopping Cart
			</h1>

			<div className="grid lg:grid-cols-3 gap-8">
				{/* Cart Items */}
				<div className="lg:col-span-2 space-y-4">
					{cartItems.map((item) => (
						<Card key={item.id}>
							<CardContent className="p-6">
								<div className="flex items-center space-x-4">
									<Image
										src={item.image_url || "/placeholder.svg"}
										alt={item.name}
										width={80}
										height={80}
										className="rounded-lg object-cover"
									/>

									<div className="flex-1">
										<h3 className="font-semibold text-lg">{item.name}</h3>
										<p className="text-blue-600 font-bold">₦{item.price}</p>
									</div>

									<div className="flex items-center space-x-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
											<Minus className="h-4 w-4" />
										</Button>
										<span className="w-12 text-center">{item.quantity}</span>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
											<Plus className="h-4 w-4" />
										</Button>
									</div>

									<div className="text-right">
										<p className="font-bold">
											₦{(item.price * item.quantity).toFixed(2)}
										</p>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleRemoveItem(item.id)}
											className="text-red-600 hover:text-red-800">
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Order Summary */}
				<div>
					<Card>
						<CardHeader>
							<CardTitle>Order Summary</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex justify-between">
								<span>Subtotal</span>
								<span>₦{total.toFixed(2)}</span>
							</div>
							<div className="flex justify-between">
								<span>Shipping</span>
								<span>Free</span>
							</div>
							<div className="border-t pt-4">
								<div className="flex justify-between font-bold text-lg">
									<span>Total</span>
									<span>₦{total.toFixed(2)}</span>
								</div>
							</div>
							<Button
								className="w-full"
								size="lg"
								asChild>
								<Link href="/checkout">Proceed to Checkout</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
