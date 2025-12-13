import { apiClient } from "./client";
import type {
  Auction,
  AuctionBid,
  CreateAuctionDto,
  CreateAuctionBidDto,
} from "@/types/auction";

export const auctionApi = {
  getAllAuctions: async (): Promise<Auction[]> => {
    const auctions = await apiClient<Auction[]>("/auctions", {
      method: "GET",
      requiresAuth: false,
    });
    return auctions;
  },

  getAuctionById: async (id: number): Promise<Auction> => {
    const auction = await apiClient<Auction>(`/auctions/${id}`, {
      method: "GET",
      requiresAuth: false,
    });
    return auction;
  },

  createAuction: async (auctionData: CreateAuctionDto): Promise<Auction> => {
    const auction = await apiClient<Auction>("/auctions", {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify({ auction: auctionData }),
    });
    return auction;
  },

  cancelAuction: async (id: number): Promise<Auction> => {
    const auction = await apiClient<Auction>(`/auctions/${id}`, {
      method: "DELETE",
      requiresAuth: true,
    });
    return auction;
  },

  placeBid: async (bidData: CreateAuctionBidDto): Promise<AuctionBid> => {
    const bid = await apiClient<AuctionBid>("/auction-bids", {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify({ auction_bid: bidData }),
    });
    return bid;
  },
};
