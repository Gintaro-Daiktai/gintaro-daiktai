import { apiClient } from "./client";
import type {
  UserStatisticsDto,
  AuctionListItemDto,
  AuctionStatisticsDto,
  DeliveryStatisticsDto,
  LotteryListItemDto,
  LotteryStatisticsDto,
  BrowseStatisticsDto,
  PopularTagDto,
} from "@/types/statistics";

export const statisticsApi = {
  getUserStatistics: async (userId: number): Promise<UserStatisticsDto> => {
    return await apiClient<UserStatisticsDto>(`/statistics/users/${userId}`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  getAuctionsList: async (): Promise<AuctionListItemDto[]> => {
    return await apiClient<AuctionListItemDto[]>("/statistics/auctions/list", {
      method: "GET",
      requiresAuth: true,
    });
  },

  getLotteriesList: async (): Promise<LotteryListItemDto[]> => {
    return await apiClient<LotteryListItemDto[]>("/statistics/lotteries/list", {
      method: "GET",
      requiresAuth: true,
    });
  },

  getAuctionStatistics: async (
    auctionId: number,
  ): Promise<AuctionStatisticsDto> => {
    return await apiClient<AuctionStatisticsDto>(
      `/statistics/auction/${auctionId}`,
      {
        method: "GET",
        requiresAuth: true,
      },
    );
  },

  getLotteryStatistics: async (
    lotteryId: number,
  ): Promise<LotteryStatisticsDto> => {
    return await apiClient<LotteryStatisticsDto>(
      `/statistics/lotteries/${lotteryId}`,
      {
        method: "GET",
        requiresAuth: true,
      },
    );
  },

  getDeliveryStatistics: async (): Promise<DeliveryStatisticsDto> => {
    return await apiClient<DeliveryStatisticsDto>("/statistics/deliveries", {
      method: "GET",
      requiresAuth: true,
    });
  },

  getBrowseStatistics: async (filters?: {
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    status?: string;
    category?: string;
  }): Promise<BrowseStatisticsDto> => {
    const params = new URLSearchParams();
    if (filters?.minPrice !== undefined)
      params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice !== undefined)
      params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.condition) params.append("condition", filters.condition);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.category) params.append("category", filters.category);

    const queryString = params.toString();
    const url = `/statistics/browse${queryString ? `?${queryString}` : ""}`;

    return await apiClient<BrowseStatisticsDto>(url, {
      method: "GET",
      requiresAuth: false,
    });
  },

  getPopularTags: async (limit: number = 10): Promise<PopularTagDto[]> => {
    return await apiClient<PopularTagDto[]>(
      `/statistics/popular-tags?limit=${limit}`,
      {
        method: "GET",
        requiresAuth: false,
      },
    );
  },
};
