import { useCallback } from "react";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { createDepositSession } from "@/lib/balance";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout({ amountInCents }: { amountInCents: number }) {
  const startSession = useCallback(async () => {
    const secret = await createDepositSession(amountInCents);
    if (!secret) {
      throw new Error(
        "Failed to create deposit session: no client secret returned",
      );
    }
    return secret;
  }, [amountInCents]);

  return (
    <div id="checkout" className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret: startSession,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
