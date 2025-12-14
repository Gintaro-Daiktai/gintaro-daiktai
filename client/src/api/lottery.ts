import { apiClient } from "./client";
import type {
  CreateLotteryBidDto,
  CreateLotteryDto,
  LotteryFull,
} from "@/types/lottery";

export const lotteryApi = {
  getAllLotteries: async (): Promise<LotteryFull[]> => {
    return apiClient<LotteryFull[]>("/lotteries", {
      method: "GET",
      requiresAuth: false,
    });
  },

  getLotteryById: async (lotteryId: number): Promise<LotteryFull> => {
    return apiClient<LotteryFull>(`/lotteries/${lotteryId}`, {
      method: "GET",
      requiresAuth: false,
    });
  },

  createLottery: async (
    createLotteryDto: CreateLotteryDto,
  ): Promise<LotteryFull> => {
    const auction = await apiClient<LotteryFull>("/lotteries", {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify({ lottery: createLotteryDto }),
    });
    return auction;
  },

  createLotteryBid: async (
    createLotteryBidDto: CreateLotteryBidDto,
  ): Promise<LotteryFull> => {
    const auction = await apiClient<LotteryFull>("/lottery-bids", {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify({ lottery_bid: createLotteryBidDto }),
    });
    return auction;
  },
};
