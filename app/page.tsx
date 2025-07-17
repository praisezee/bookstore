import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Cookie, ShoppingBag, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product-card";

async function getFeaturedProducts() {
	return prisma.products.findMany({
		take: 6,
		include: {
			categories: true,
		},
		orderBy: {
			created_at: "desc",
		},
	});
}

export default async function HomePage() {
	const featuredProducts = await getFeaturedProducts();

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<h1 className="text-4xl md:text-6xl font-bold mb-6">
								Books & Pastries
								<span className="block text-emerald-200">Delivered Fresh</span>
							</h1>
							<p className="text-xl mb-8 text-emerald-100">
								Discover our curated collection of hardcopy books and freshly baked
								pastries. Perfect for book lovers and food enthusiasts alike.
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Button
									size="lg"
									className="bg-white text-emerald-600 hover:bg-gray-100">
									<Link href="/products">Shop Now</Link>
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="border-white text-white hover:bg-white hover:text-emerald-600 bg-transparent">
									Learn More
								</Button>
							</div>
						</div>
						<div className="relative">
							<Image
								src="/placeholder.svg?height=400&width=500"
								alt="Books and Pastries"
								width={500}
								height={400}
								className="rounded-lg shadow-2xl"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16 bg-muted/50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							Why Choose Us?
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							We combine the love of reading with the joy of fresh pastries
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						<Card className="text-center p-6">
							<CardContent className="pt-6">
								<Book className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
								<h3 className="text-xl font-semibold mb-2">Curated Books</h3>
								<p className="text-gray-600">
									Handpicked collection of the finest hardcopy books across all genres
								</p>
							</CardContent>
						</Card>

						<Card className="text-center p-6">
							<CardContent className="pt-6">
								<Cookie className="h-12 w-12 text-orange-600 mx-auto mb-4" />
								<h3 className="text-xl font-semibold mb-2">Fresh Pastries</h3>
								<p className="text-gray-600">
									Daily baked pastries made with premium ingredients and traditional
									recipes
								</p>
							</CardContent>
						</Card>

						<Card className="text-center p-6">
							<CardContent className="pt-6">
								<ShoppingBag className="h-12 w-12 text-green-600 mx-auto mb-4" />
								<h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
								<p className="text-gray-600">
									Quick and reliable delivery to bring your orders fresh to your doorstep
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Featured Products */}
			<section className="py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
							Featured Products
						</h2>
						<p className="text-xl text-gray-600 dark:text-gray-300">
							Check out our latest and most popular items
						</p>
					</div>

					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{featuredProducts.map((product) => (
							<ProductCard
								key={product.id}
								product={{
									...product,
									price: Number(product.price),
									description: product.description ?? "",
									image_url: product.image_url ?? "/placeholder.svg",
									category_id: product.category_id ?? "",
								}}
							/>
						))}
					</div>

					<div className="text-center mt-12">
						<Button
							size="lg"
							asChild>
							<Link href="/products">View All Products</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="py-16 bg-muted/50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							What Our Customers Say
						</h2>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{[1, 2, 3].map((i) => (
							<Card
								key={i}
								className="p-6">
								<CardContent className="pt-6">
									<div className="flex mb-4">
										{[1, 2, 3, 4, 5].map((star) => (
											<Star
												key={star}
												className="h-5 w-5 text-yellow-400 fill-current"
											/>
										))}
									</div>
									<p className="text-gray-600 mb-4">
										"Amazing selection of books and the pastries are absolutely delicious!
										Perfect combination for a cozy reading session."
									</p>
									<div className="flex items-center">
										<Image
											src="/placeholder.svg?height=40&width=40"
											alt="Customer"
											width={40}
											height={40}
											className="rounded-full mr-3"
										/>
										<div>
											<p className="font-semibold">Sarah Johnson</p>
											<p className="text-sm text-gray-500">Book Lover</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
