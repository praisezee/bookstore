import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AddToCartButton from "@/components/add-to-cart-button";

interface ProductPageProps {
	params: {
		id: string;
	};
}

async function getProduct(id: string) {
	return prisma.products.findUnique({
		where: { id },
		include: {
			categories: true,
		},
	});
}

export default async function ProductPage({ params }: ProductPageProps) {
	const product = await getProduct(params.id);

	if (!product) {
		notFound();
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="grid md:grid-cols-2 gap-12">
				{/* Product Image */}
				<div className="aspect-square relative">
					<Image
						src={product.image_url || "/placeholder.svg"}
						alt={product.name}
						fill
						className="object-cover rounded-lg"
					/>
				</div>

				{/* Product Details */}
				<div className="space-y-6">
					<div>
						{product.categories && (
							<Badge
								variant="secondary"
								className="mb-2">
								{product.categories.name}
							</Badge>
						)}
						<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
							{product.name}
						</h1>
						<p className="text-4xl font-bold text-blue-600 mb-4">
							₦{product.price.toFixed(2)}
						</p>

						<div className="flex items-center gap-4 mb-6">
							{product.stock_quantity > 0 ? (
								<Badge
									variant="default"
									className="bg-green-100 text-green-800">
									In Stock ({product.stock_quantity} available)
								</Badge>
							) : (
								<Badge variant="destructive">Out of Stock</Badge>
							)}
						</div>
					</div>

					<Separator />

					<div>
						<h2 className="text-xl font-semibold mb-3">Description</h2>
						<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
							{product.description}
						</p>
					</div>

					<Separator />

					<div className="space-y-4">
						<AddToCartButton
							product={{
								...product,
								price: Number(product.price),
								description: product.description ?? "",
								image_url: product.image_url ?? "/placeholder.svg",
								category_id: product.category_id ?? "",
							}}
							className="text-lg py-6"
						/>

						<div className="text-sm text-gray-500 space-y-1">
							<p>• Free delivery on orders over ₦50</p>
							<p>• 30-day return policy</p>
							<p>• Secure payment processing</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
