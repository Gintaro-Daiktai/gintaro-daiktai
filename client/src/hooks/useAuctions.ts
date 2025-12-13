import { useState, useEffect, useCallback } from "react";
import { auctionApi } from "@/api/auction";
import type { Auction } from "@/types/auction";

export function useAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAuctions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await auctionApi.getAllAuctions();
      setAuctions(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load auctions:", err);
      setError("Failed to load auctions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuctions();
  }, [loadAuctions]);

  return {
    auctions,
    isLoading,
    error,
    refetch: loadAuctions,
  };
}

export function useAuction(id: number | null) {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAuction = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await auctionApi.getAuctionById(id);
      setAuction(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load auction:", err);
      setError("Failed to load auction");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAuction();
  }, [loadAuction]);

  return {
    auction,
    isLoading,
    error,
    refetch: loadAuction,
  };
}

export function useUserAuctions(userId: number | null) {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserAuctions = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await auctionApi.getUserAuctions(userId);
      setAuctions(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load user auctions:", err);
      setError("Failed to load user auctions");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadUserAuctions();
  }, [loadUserAuctions]);

  return {
    auctions,
    isLoading,
    error,
    refetch: loadUserAuctions,
  };
}
