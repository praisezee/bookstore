import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react";
import DeleteProductButton from "@/components/admin/delete-product-button";

async function getProducts() {
	return prisma.products.findMany({
		include: {
			categories: true,
		},
		orderBy: {
			created_at: "desc",
		},
	});
}

export default async function AdminProductsPage() {
	const products = await getProducts();

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Products</h1>
				<Button asChild>
					<Link href="/admin/products/new">
						<Plus className="h-4 w-4 mr-2" />
						Add Product
					</Link>
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{products.map((product) => (
					<Card key={product.id}>
						<CardContent className="p-4">
							<div className="aspect-square relative mb-4">
								<Image
									src={product.image_url || "/placeholder.svg"}
									alt={product.name}
									fill
									className="object-cover rounded-lg"
								/>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<h3 className="font-semibold truncate">{product.name}</h3>
									{product.categories && (
										<Badge variant="secondary">{product.categories.name}</Badge>
									)}
								</div>

								<p className="text-sm text-muted-foreground line-clamp-2">
									{product.description}
								</p>

								<div className="flex items-center justify-between">
									<span className="text-lg font-bold">
										₦{Number(product.price).toFixed(2)}
									</span>
									<span
										className={`text-sm px-2 py-1 rounded ${
											product.stock_quantity > 0
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}>
										Stock: {product.stock_quantity}
									</span>
								</div>

								<div className="flex gap-2 pt-2">
									<Button
										variant="outline"
										size="sm"
										asChild
										className="flex-1 bg-transparent">
										<Link href={`/admin/products/${product.id}/edit`}>
											<Edit className="h-4 w-4 mr-1" />
											Edit
										</Link>
									</Button>
									<DeleteProductButton productId={product.id} />
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{products.length === 0 && (
				<div className="text-center py-12">
					<p className="text-muted-foreground mb-4">No products found.</p>
					<Button asChild>
						<Link href="/admin/products/new">Add your first product</Link>
					</Button>
				</div>
			)}
		</div>
	);
}
