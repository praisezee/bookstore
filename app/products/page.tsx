"use client";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product-card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface ProductsPageProps {
	searchParams: {
		category?: string;
		sort?: string;
	};
}

async function getProducts(category?: string, sort?: string) {
	const where = category
		? {
				categories: {
					name: {
						equals: category,
						mode: "insensitive" as const,
					},
				},
		  }
		: {};

	const orderBy =
		sort === "price-asc"
			? { price: "asc" as const }
			: sort === "price-desc"
			? { price: "desc" as const }
			: sort === "name"
			? { name: "asc" as const }
			: { created_at: "desc" as const };

	return prisma.products.findMany({
		where,
		include: {
			categories: true,
		},
		orderBy,
	});
}

async function getCategories() {
	return prisma.categories.findMany({
		orderBy: { name: "asc" },
	});
}

export default async function ProductsPage({
	searchParams,
}: ProductsPageProps) {
	const products = await getProducts(searchParams.category, searchParams.sort);
	const categories = await getCategories();

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
						{searchParams.category
							? `${
									searchParams.category.charAt(0).toUpperCase() +
									searchParams.category.slice(1)
							  }`
							: "All Products"}
					</h1>
					<p className="text-gray-600 dark:text-gray-300">
						{products.length} product{products.length !== 1 ? "s" : ""} found
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
					<Select defaultValue={searchParams.category || "all"}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							{categories.map((category) => (
								<SelectItem
									key={category.id}
									value={category.name.toLowerCase()}
									onChange={async () =>
										await getProducts(
											category.name.toLowerCase(),
											searchParams.sort || "newest"
										)
									}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select defaultValue={searchParams.sort || "newest"}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem
								value="newest"
								onChange={async () =>
									await getProducts(searchParams.category || "all", "newest")
								}>
								Newest First
							</SelectItem>
							<SelectItem
								value="name"
								onChange={async () =>
									await getProducts(searchParams.category || "all", "name")
								}>
								Name A-Z
							</SelectItem>
							<SelectItem
								value="price-asc"
								onChange={async () =>
									await getProducts(searchParams.category || "all", "price-asc")
								}>
								Price: Low to High
							</SelectItem>
							<SelectItem
								value="price-desc"
								onChange={async () =>
									await getProducts(searchParams.category || "all", "price-desc")
								}>
								Price: High to Low
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{products.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-gray-500 text-lg">No products found.</p>
				</div>
			) : (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{products.map((product) => (
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
			)}
		</div>
	);
}
