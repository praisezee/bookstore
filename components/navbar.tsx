"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCart } from "@/lib/cart";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [cartCount, setCartCount] = useState(0);

	useEffect(() => {
		const updateCartCount = () => {
			const cart = getCart();
			setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
		};

		updateCartCount();
		window.addEventListener("cartUpdated", updateCartCount);

		return () => window.removeEventListener("cartUpdated", updateCartCount);
	}, []);

	return (
		<nav className="bg-background shadow-lg sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<Link
							href="/"
							className="flex items-center space-x-2">
							<Book className="h-8 w-8 text-emerald-600" />
							<span className="font-bold text-xl text-gray-900 dark:text-gray-100">
								BookStore & Bakery
							</span>
						</Link>
					</div>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center space-x-8">
						<Link
							href="/"
							className="text-foreground hover:text-emerald-600 transition-colors">
							Home
						</Link>
						<Link
							href="/products"
							className="text-foreground hover:text-emerald-600 transition-colors">
							All Products
						</Link>
						{/* <Link
							href="/products?category=books"
							className="text-foreground hover:text-emerald-600 transition-colors">
							Books
						</Link>
						<Link
							href="/products?category=pastries"
							className="text-foreground hover:text-emerald-600 transition-colors">
							Pastries
						</Link> */}
						<ThemeToggle />
						<Link
							href="/cart"
							className="relative">
							<Button
								variant="outline"
								size="sm">
								<ShoppingCart className="h-4 w-4 mr-2" />
								Cart
								{cartCount > 0 && (
									<span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
										{cartCount}
									</span>
								)}
							</Button>
						</Link>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden flex items-center">
						<Link
							href="/cart"
							className="relative mr-4">
							<Button
								variant="outline"
								size="sm">
								<ShoppingCart className="h-4 w-4" />
								{cartCount > 0 && (
									<span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
										{cartCount}
									</span>
								)}
							</Button>
						</Link>
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="text-foreground hover:text-emerald-600">
							{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isOpen && (
					<div className="md:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
							<Link
								href="/"
								className="block px-3 py-2 text-foreground hover:text-emerald-600"
								onClick={() => setIsOpen(false)}>
								Home
							</Link>
							<Link
								href="/products"
								className="block px-3 py-2 text-foreground hover:text-emerald-600"
								onClick={() => setIsOpen(false)}>
								All Products
							</Link>
							{/* <Link
								href="/products?category=books"
								className="block px-3 py-2 text-foreground hover:text-emerald-600"
								onClick={() => setIsOpen(false)}>
								Books
							</Link>
							<Link
								href="/products?category=pastries"
								className="block px-3 py-2 text-foreground hover:text-emerald-600"
								onClick={() => setIsOpen(false)}>
								Pastries
							</Link> */}
							<ThemeToggle />
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
