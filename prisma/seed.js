const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

(async () => {
	try {
		await prisma.admin_users.deleteMany();
		const hashedPwd = await hash("admin123", 10);
		await prisma.admin_users.create({
			data: {
				username: "admin",
				password_hash: hashedPwd,
				email: "admin@gmail.com",
			},
		});
		console.log("Admin seeded");
	} catch (error) {
		console.error(error);
	}
})();
