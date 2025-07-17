import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react";
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
	async function getDashboardStats() {
		const [totalProducts, totalOrders, totalRevenue, recentOrders] =
			await Promise.all([
				prisma.products.count(),
				prisma.orders.count(),
				prisma.orders.aggregate({
					_sum: {
						total_amount: true,
					},
					where: {
						payment_status: "completed",
					},
				}),
				prisma.orders.findMany({
					take: 5,
					orderBy: {
						created_at: "desc",
					},
					include: {
						order_items: {
							include: {
								products: true,
							},
						},
					},
				}),
			]);

		return {
			totalProducts,
			totalOrders,
			totalRevenue: totalRevenue._sum.total_amount || 0,
			recentOrders,
		};
	}
	const stats = await getDashboardStats();

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-6">Dashboard</h1>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Products</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalProducts}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Orders</CardTitle>
						<ShoppingCart className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalOrders}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							₦{Number(stats.totalRevenue).toFixed(2)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							₦
							{stats.totalOrders > 0
								? (Number(stats.totalRevenue) / stats.totalOrders).toFixed(2)
								: "0.00"}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Orders */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Orders</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{stats.recentOrders.map((order) => (
							<div
								key={order.id}
								className="flex items-center justify-between p-4 border rounded-lg">
								<div>
									<p className="font-medium">{order.customer_name}</p>
									<p className="text-sm text-muted-foreground">{order.customer_email}</p>
									<p className="text-sm text-muted-foreground">
										{order.order_items.length} item(s)
									</p>
								</div>
								<div className="text-right">
									<p className="font-bold">₦{Number(order.total_amount).toFixed(2)}</p>
									<p
										className={`text-sm px-2 py-1 rounded-full ${
											order.status === "completed"
												? "bg-green-100 text-green-800"
												: order.status === "confirmed"
												? "bg-blue-100 text-blue-800"
												: "bg-yellow-100 text-yellow-800"
										}`}>
										{order.status}
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
