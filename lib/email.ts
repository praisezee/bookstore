import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number.parseInt(process.env.SMTP_PORT || "587"),
	secure:
		process.env.SMTP_PORT && process.env.SMTP_PORT === "587" ? false : true,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

export async function sendOrderConfirmationEmail(order: any) {
	const mailOptions = {
		from: process.env.SMTP_USER,
		to: order.customer_email,
		subject: `Order Confirmation - ${order.id}`,
		html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #059669;">Order Confirmation</h1>
        <p>Dear ${order.customer_name},</p>
        <p>Thank you for your order! Your order has been confirmed and is being processed.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Total Amount:</strong> ₦${order.total_amount}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Shipping Address:</strong> ${order.shipping_address}</p>
        </div>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Items Ordered:</h3>
          ${
											order.order_items
												?.map(
													(item: any) => `
            <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
              <p><strong>${
															item.product?.name || item.products?.name
														}</strong></p>
              <p>Quantity: ${item.quantity} × ₦${item.price} = ₦${(
														item.quantity * item.price
													).toFixed(2)}</p>
            </div>
          `
												)
												.join("") || ""
										}
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${order.confirmation_url || "#"}" 
             style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Order Details & Download Invoice
          </a>
        </div>

        <p>We'll send you another email when your order ships.</p>
        <p>Thank you for shopping with BookStore & Bakery!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            If you have any questions, please contact us at support@bookstore.com
          </p>
        </div>
      </div>
    `,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log("Order confirmation email sent successfully");
	} catch (error) {
		console.error("Failed to send order confirmation email:", error);
	}
}
