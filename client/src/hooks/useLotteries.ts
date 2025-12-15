import { lotteryApi } from "@/api/lottery";
import type { Lottery } from "@/types/lottery";
import { useCallback, useEffect, useState } from "react";

export function useLottery(id: number | null) {
  const [lottery, setLottery] = useState<Lottery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLottery = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await lotteryApi.getLotteryById(id);
      setLottery(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load lottery:", err);
      setError("Failed to load lottery");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadLottery();
  }, [loadLottery]);

  return {
    lottery,
    isLoading,
    error,
    refetch: loadLottery,
  };
}
