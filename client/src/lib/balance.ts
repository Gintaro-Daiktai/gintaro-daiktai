//THE CURRENT STRIPE SETUP IS VERY BAD AND EXPOSES PRIVATE STRIPE KEY TO CLEINT, ONLY FOR DEMO PURPOSES. DO NOT USE THIS IN PRODUCTION
import { stripe } from "./stripe";

export async function createDepositSession(amountInCents: number) {
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Account Balance Deposit",
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
  });

  return session.client_secret;
}
export async function processWithdrawal(amountInCents: number) {
  // Placeholder for withdrawal processing logic
  console.log(`Processing withdrawal of ${amountInCents} cents`);

  return { success: true, message: "Withdrawal processed successfully" };
}
