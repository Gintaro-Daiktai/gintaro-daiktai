import { apiClient } from "./client";
import type {
  CreateLotteryBidDto,
  CreateLotteryDto,
  Lottery,
} from "@/types/lottery";

export const lotteryApi = {
  getAllLotteries: async (): Promise<Lottery[]> => {
    return apiClient<Lottery[]>("/lotteries", {
      method: "GET",
      requiresAuth: false,
    });
  },

  getLotteryById: async (lotteryId: number): Promise<Lottery> => {
    return apiClient<Lottery>(`/lotteries/${lotteryId}`, {
      method: "GET",
      requiresAuth: false,
    });
  },

  createLottery: async (
    createLotteryDto: CreateLotteryDto,
  ): Promise<Lottery> => {
    const auction = await apiClient<Lottery>("/lotteries", {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify({ lottery: createLotteryDto }),
    });
    return auction;
  },

  createLotteryBid: async (
    createLotteryBidDto: CreateLotteryBidDto,
  ): Promise<Lottery> => {
    const auction = await apiClient<Lottery>("/lottery-bids", {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify({ lottery_bid: createLotteryBidDto }),
    });
    return auction;
  },
};
