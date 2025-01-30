import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(
  email: string,
  orderDetails: {
    customerName: string;
    orderNumber: string;
    totalAmount: number;
  }
) {
  try {
    await resend.emails.send({
      from: "Store <noreply@yourdomain.com>",
      to: email,
      subject: "Order Confirmation",
      html: `
        <h1>Thank you for your order, ${orderDetails.customerName}!</h1>
        <p>Order Number: ${orderDetails.orderNumber}</p>
        <p>Total Amount: ${orderDetails.totalAmount.toFixed(2)} DH</p>
        <p>We will contact you shortly on your provided phone number to confirm your order.</p>
        <p>Note: If we cannot reach you after two attempts, your order will be automatically cancelled.</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    throw error;
  }
}
