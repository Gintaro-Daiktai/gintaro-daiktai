import Stripe from "stripe";

if (!import.meta.env.VITE_STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

export const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
