import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import AddToCartButton from "./add-to-cart-button";

interface ProductCardProps {
	product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
	return (
		<Card className="overflow-hidden hover:shadow-lg transition-shadow">
			<Link href={`/products/${product.id}`}>
				<div className="aspect-square relative">
					<Image
						src={product.image_url || "/placeholder.svg"}
						alt={product.name}
						fill
						className="object-cover hover:scale-105 transition-transform duration-300"
					/>
				</div>
			</Link>
			<CardContent className="p-4">
				<Link href={`/products/${product.id}`}>
					<h3 className="font-semibold text-lg mb-2 hover:text-emerald-600 transition-colors">
						{product.name}
					</h3>
				</Link>
				<p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
					{product.description}
				</p>
				<p className="text-2xl font-bold text-emerald-600">
					₦{product.price.toFixed(2)}
				</p>
				{product.stock_quantity > 0 ? (
					<p className="text-green-600 text-sm">
						In Stock ({product.stock_quantity})
					</p>
				) : (
					<p className="text-red-600 text-sm">Out of Stock</p>
				)}
			</CardContent>
			<CardFooter className="p-4 pt-0">
				<AddToCartButton product={product} />
			</CardFooter>
		</Card>
	);
}
