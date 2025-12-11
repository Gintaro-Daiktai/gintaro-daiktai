import { apiClient } from "./client";
import type { Delivery } from "@/types/delivery";

export const deliveryApi = {
  getDeliveryById: async (id: number): Promise<Delivery> => {
    const delivery = await apiClient<Delivery>(`/deliveries/${id}`, {
      method: "GET",
      requiresAuth: true,
    });
    return delivery;
  },

  getMyDeliveries: async (): Promise<Delivery[]> => {
    const deliveries = await apiClient<Delivery[]>(
      "/deliveries/my-deliveries",
      {
        method: "GET",
        requiresAuth: true,
      },
    );
    return deliveries;
  },
};
