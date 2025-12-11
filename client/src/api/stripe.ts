import { apiClient } from "./client";

export async function createDepositSession(amountInCents: number) {
  const response = await apiClient<{ clientSecret: string }>(
    "/stripe/create-checkout-session",
    {
      method: "POST",
      body: JSON.stringify({ amount: amountInCents }),
      requiresAuth: true,
    },
  );
  return response.clientSecret;
}

export async function processWithdrawal(amountInCents: number) {
  const response = await apiClient<{
    success: boolean;
    message: string;
    newBalance: number;
  }>("/stripe/withdraw", {
    method: "POST",
    body: JSON.stringify({ amount: amountInCents }),
    requiresAuth: true,
  });
  return response;
}

export async function getSessionStatus(sessionId: string) {
  const response = await apiClient<{
    status: string;
    payment_status: string;
  }>(`/stripe/session/${sessionId}`, {
    method: "GET",
    requiresAuth: true,
  });
  return response;
}
