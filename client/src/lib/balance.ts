import {
  createDepositSession as createDepositSessionApi,
  processWithdrawal as processWithdrawalApi,
} from "@/api/stripe";

export async function createDepositSession(amountInCents: number) {
  return await createDepositSessionApi(amountInCents);
}

export async function processWithdrawal(amountInCents: number) {
  return await processWithdrawalApi(amountInCents);
}
