"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, ArrowLeft, Printer } from "lucide-react";
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

export default function OrderConfirmationPage({
	params,
}: {
	params: { id: string };
}) {
	const router = useRouter();
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchOrder();
	}, []);

	const fetchOrder = async () => {
		try {
			const response = await fetch(`/api/orders/${params.id}`);
			if (response.ok) {
				const data = await response.json();
				setOrder(data);
			} else {
				toast.error("Failed to load order");
				router.push("/");
			}
		} catch (error) {
			console.error("Failed to fetch order:", error);
			toast.error("Failed to load order");
			router.push("/");
		} finally {
			setLoading(false);
		}
	};

	const downloadInvoice = async () => {
		if (!order) return;

		try {
			// Dynamic import to avoid SSR issues
			const { jsPDF } = await import("jspdf");
			const { autoTable } = await import("jspdf-autotable");

			const doc = new jsPDF();

			// Add logo/header
			doc.setFontSize(20);
			doc.setTextColor(34, 197, 94); // Green color
			doc.text("BookStore & Bakery", 105, 20, { align: "center" });

			doc.setFontSize(14);
			doc.setTextColor(0, 0, 0);
			doc.text("INVOICE", 105, 30, { align: "center" });

			// Add order info
			doc.setFontSize(10);
			doc.text(`Invoice #: ${order.id.slice(0, 8)}`, 20, 45);
			doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 20, 50);
			doc.text(`Payment Status: ${order.payment_status}`, 20, 55);

			// Add customer info
			doc.text("Bill To:", 140, 45);
			doc.text(order.customer_name, 140, 50);
			doc.text(order.customer_email, 140, 55);
			doc.text(order.customer_phone || "N/A", 140, 60);

			// Split address into multiple lines if too long
			const addressLines = order.shipping_address.match(/.{1,40}/g) || [
				order.shipping_address,
			];
			addressLines.forEach((line, index) => {
				doc.text(line, 140, 65 + index * 5);
			});

			// Add items table
			const tableColumn = ["Item", "Qty", "Unit Price", "Total"];
			const tableRows = order.order_items.map((item) => [
				item.products.name,
				item.quantity.toString(),
				`NGN${Number(item.price).toFixed(2)}`,
				`NGN${(Number(item.price) * item.quantity).toFixed(2)}`,
			]);

			// @ts-ignore - jspdf-autotable types
			autoTable(doc, {
				head: [tableColumn],
				body: tableRows,
				startY: 80,
				theme: "grid",
				headStyles: { fillColor: [34, 197, 94] },
			});

			// @ts-ignore - get the y position after the table
			const finalY = (doc as any).lastAutoTable.finalY || 150;

			// Add total
			doc.text(
				`Subtotal: NGN${Number(order.total_amount).toFixed(2)}`,
				140,
				finalY + 10
			);
			doc.text(`Shipping: Free`, 140, finalY + 15);
			doc.setFontSize(12);
			doc.setFont("helvetica", "bold");
			doc.text(
				`Total: NGN${Number(order.total_amount).toFixed(2)}`,
				140,
				finalY + 25
			);

			// Add footer
			doc.setFontSize(10);
			doc.setFont("helvetica", "normal");
			doc.text("Thank you for your purchase!", 105, finalY + 40, {
				align: "center",
			});
			doc.text("BookStore & Bakery", 105, finalY + 45, { align: "center" });

			// Save the PDF
			doc.save(`invoice-${order.id.slice(0, 8)}.pdf`);

			toast.success("Invoice downloaded successfully!");
		} catch (error) {
			console.error("Failed to generate invoice:", error);
			toast.error("Failed to download invoice");
		}
	};

	const printInvoice = async () => {
		if (!order) return;

		try {
			// Dynamic import to avoid SSR issues
			const { jsPDF } = await import("jspdf");
			const { autoTable } = await import("jspdf-autotable");

			const doc = new jsPDF();

			// Add logo/header
			doc.setFontSize(20);
			doc.setTextColor(34, 197, 94); // Green color
			doc.text("BookStore & Bakery", 105, 20, { align: "center" });

			doc.setFontSize(14);
			doc.setTextColor(0, 0, 0);
			doc.text("INVOICE", 105, 30, { align: "center" });

			// Add order info
			doc.setFontSize(10);
			doc.text(`Invoice #: ${order.id.slice(0, 8)}`, 20, 45);
			doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 20, 50);
			doc.text(`Payment Status: ${order.payment_status}`, 20, 55);

			// Add customer info
			doc.text("Bill To:", 140, 45);
			doc.text(order.customer_name, 140, 50);
			doc.text(order.customer_email, 140, 55);
			doc.text(order.customer_phone || "N/A", 140, 60);

			// Split address into multiple lines if too long
			const addressLines = order.shipping_address.match(/.{1,40}/g) || [
				order.shipping_address,
			];
			addressLines.forEach((line, index) => {
				doc.text(line, 140, 65 + index * 5);
			});

			// Add items table
			const tableColumn = ["Item", "Qty", "Unit Price", "Total"];
			const tableRows = order.order_items.map((item) => [
				item.products.name,
				item.quantity.toString(),
				`NGN${Number(item.price).toFixed(2)}`,
				`NGN${(Number(item.price) * item.quantity).toFixed(2)}`,
			]);

			// @ts-ignore - jspdf-autotable types
			autoTable(doc, {
				head: [tableColumn],
				body: tableRows,
				startY: 80,
				theme: "grid",
				headStyles: { fillColor: [34, 197, 94] },
			});

			// @ts-ignore - get the y position after the table
			const finalY = (doc as any).lastAutoTable.finalY || 150;

			// Add total
			doc.text(
				`Subtotal: NGN${Number(order.total_amount).toFixed(2)}`,
				140,
				finalY + 10
			);
			doc.text(`Shipping: Free`, 140, finalY + 15);
			doc.setFontSize(12);
			doc.setFont("helvetica", "bold");
			doc.text(
				`Total: NGN${Number(order.total_amount).toFixed(2)}`,
				140,
				finalY + 25
			);

			// Add footer
			doc.setFontSize(10);
			doc.setFont("helvetica", "normal");
			doc.text("Thank you for your purchase!", 105, finalY + 40, {
				align: "center",
			});
			doc.text("BookStore & Bakery", 105, finalY + 45, { align: "center" });

			doc.autoPrint();
			//This is a key for printing
			doc.output("dataurlnewwindow");
		} catch (error) {
			console.error("Failed to generate invoice:", error);
			toast.error("Failed to download invoice");
		}
	};

	if (loading) {
		return (
			<div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
				<p>Loading order details...</p>
			</div>
		);
	}

	if (!order) {
		return (
			<div className="max-w-4xl mx-auto px-4 py-12 text-center">
				<h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
				<p className="mb-6">
					Sorry, we couldn't find the order you're looking for.
				</p>
				<Button asChild>
					<Link href="/">Return to Home</Link>
				</Button>
			</div>
		);
	}

	return (
		<>
			<style
				jsx
				global>{`
				@media print {
					@page {
						margin: 1cm;
					}

					body {
						font-family: Arial, sans-serif;
						color: #000;
						background: #fff;
					}

					.print-hidden {
						display: none !important;
					}

					.print-shadow-none {
						box-shadow: none !important;
					}
				}
			`}</style>

			<div className="max-w-4xl mx-auto px-4 py-12">
				{/* Success Message */}
				<div className="text-center mb-8 print-hidden">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
						<CheckCircle className="h-8 w-8 text-green-600" />
					</div>
					<h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
					<p className="text-gray-600 mb-4">
						Thank you for your purchase. Your order has been confirmed and is being
						processed.
					</p>
					<p className="text-sm text-gray-500">
						A confirmation email has been sent to{" "}
						<span className="font-medium">{order.customer_email}</span>
					</p>
				</div>

				{/* Order Details Card */}
				<Card
					className="mb-8 print-shadow-none"
					id="invoice-content">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Order Details</CardTitle>
						<div className="text-sm text-muted-foreground">
							Order #{order.id.slice(0, 8)}
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Order Summary */}
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h3 className="font-semibold mb-2">Shipping Information</h3>
								<div className="text-sm space-y-1">
									<p>{order.customer_name}</p>
									<p>{order.customer_email}</p>
									<p>{order.customer_phone}</p>
									<p className="whitespace-pre-line">{order.shipping_address}</p>
								</div>
							</div>
							<div>
								<h3 className="font-semibold mb-2">Order Information</h3>
								<div className="text-sm space-y-1">
									<p>
										<span className="text-muted-foreground">Date:</span>{" "}
										{new Date(order.created_at).toLocaleDateString()}
									</p>
									<p>
										<span className="text-muted-foreground">Status:</span>{" "}
										<Badge
											variant="outline"
											className="ml-1">
											{order.status}
										</Badge>
									</p>
									<p>
										<span className="text-muted-foreground">Payment Status:</span>{" "}
										<Badge
											variant="outline"
											className="ml-1">
											{order.payment_status}
										</Badge>
									</p>
									{order.payment_reference && (
										<p>
											<span className="text-muted-foreground">Payment Reference:</span>{" "}
											{order.payment_reference}
										</p>
									)}
								</div>
							</div>
						</div>

						<Separator />

						{/* Order Items */}
						<div>
							<h3 className="font-semibold mb-4">Order Items</h3>
							<div className="space-y-4">
								{order.order_items.map((item) => (
									<div
										key={item.id}
										className="flex items-center gap-4">
										<div className="h-16 w-16 relative flex-shrink-0">
											<Image
												src={item.products.image_url || "/placeholder.svg"}
												alt={item.products.name}
												fill
												className="object-cover rounded-md"
											/>
										</div>
										<div className="flex-1">
											<p className="font-medium">{item.products.name}</p>
											<p className="text-sm text-muted-foreground">
												Quantity: {item.quantity} × ₦{Number(item.price).toFixed(2)}
											</p>
										</div>
										<div className="text-right">
											<p className="font-semibold">
												₦{(Number(item.price) * item.quantity).toFixed(2)}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>

						<Separator />

						{/* Order Total */}
						<div className="flex justify-end">
							<div className="w-full max-w-xs space-y-2">
								<div className="flex justify-between">
									<span>Subtotal</span>
									<span>₦{Number(order.total_amount).toFixed(2)}</span>
								</div>
								<div className="flex justify-between">
									<span>Shipping</span>
									<span>Free</span>
								</div>
								<Separator />
								<div className="flex justify-between font-bold">
									<span>Total</span>
									<span>₦{Number(order.total_amount).toFixed(2)}</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 print-hidden">
					<Button
						onClick={downloadInvoice}
						className="flex-1">
						<Download className="mr-2 h-4 w-4" />
						Download Invoice
					</Button>
					<Button
						variant="outline"
						onClick={printInvoice}
						className="flex-1 bg-transparent">
						<Printer className="mr-2 h-4 w-4" />
						Print Invoice
					</Button>
					<Button
						variant="secondary"
						asChild
						className="flex-1">
						<Link href="/">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Continue Shopping
						</Link>
					</Button>
				</div>
			</div>
		</>
	);
}
