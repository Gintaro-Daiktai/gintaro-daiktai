import { useState, useEffect } from "react";
import { deliveryApi } from "@/api/delivery";
import type { Delivery } from "@/types/delivery";

export function useDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDeliveries = async () => {
      try {
        const data = await deliveryApi.getMyDeliveries();
        setDeliveries(data);
      } catch (err) {
        console.error("Failed to load deliveries:", err);
        setError("Failed to load deliveries");
      } finally {
        setIsLoading(false);
      }
    };

    loadDeliveries();
  }, []);

  const filterByStatus = (status: string) => {
    return deliveries.filter((d) => d.order_status === status);
  };

  return {
    deliveries,
    isLoading,
    error,
    filterByStatus,
  };
}
